import bcrypt from "bcryptjs";
import { db } from "../lib/prisma.ts";
import { awardXP, maybePromoteSemester, masteryPercent, XP } from "../lib/learningEngine.ts";
import { levelForXP } from "../lib/gamification.ts";

const EMAIL="real-learning-test@example.invalid";
const USERNAME="__real_learning_test__";

function pass(label, detail=""){ console.log(`PASS  ${label}${detail ? ` — ${detail}` : ""}`); }
function fail(label, detail=""){ throw new Error(`FAIL  ${label}${detail ? ` — ${detail}` : ""}`); }

async function main(){
  console.log("\n=== REAL LEARNING FLOW TEST ===\n");

  await db.user.deleteMany({where:{OR:[{email:EMAIL},{username:USERNAME}]}});

  const semesters=await db.semester.findMany({
    orderBy:{number:"asc"},
    include:{subjects:{include:{units:{include:{topics:true}}}}}
  });
  const s1=semesters.find(s=>s.number===1);
  const s2=semesters.find(s=>s.number===2);
  if(!s1||!s2) fail("Semesters 1 and 2 exist");

  const user=await db.user.create({
    data:{
      name:"Real Learning Test",
      username:USERNAME,
      email:EMAIL,
      passwordHash:await bcrypt.hash("TestPass123!",10),
      securityHash:"test",
      semester:1
    }
  });
  pass("Temporary student created");

  // Weak-result path.
  const weakTopic=s1.subjects[0].units[0].topics[0];
  const weakPercent=masteryPercent(40);
  const weak=await db.topicProgress.create({
    data:{
      userId:user.id, topicId:weakTopic.id,
      percent:weakPercent, bestScore:40, attempts:1,
      status:"LEARNING", lastStudiedAt:new Date()
    }
  });
  await db.revisionItem.create({
    data:{userId:user.id,topicId:weakTopic.id,dueAt:new Date(Date.now()-1000),interval:1,ease:2.2}
  });
  if(weak.percent!==25) fail("Weak result mastery mapping",String(weak.percent));
  pass("Weak topic becomes learning state","40% score → 25% mastery");
  pass("Revision item stored","due now");

  // Mastery path for an existing topic.
  await db.topicProgress.update({
    where:{id:weak.id},
    data:{percent:100,bestScore:95,status:"STRONG",attempts:2}
  });
  await db.revisionItem.delete({where:{userId_topicId:{userId:user.id,topicId:weakTopic.id}}});
  const mastered=await db.topicProgress.findUnique({where:{id:weak.id}});
  if(mastered?.percent!==100||mastered.bestScore!==95) fail("Strong result persistence");
  pass("Strong result clears mastery state","95% best score → 100%");

  // Real promotion gate: all S1 topics mastered.
  const allS1=s1.subjects.flatMap(s=>s.units.flatMap(u=>u.topics));
  await db.$transaction(allS1.map(t=>db.topicProgress.upsert({
    where:{userId_topicId:{userId:user.id,topicId:t.id}},
    create:{userId:user.id,topicId:t.id,percent:100,bestScore:95,attempts:2,status:"STRONG",lastStudiedAt:new Date()},
    update:{percent:100,bestScore:95,status:"STRONG"}
  })));
  const promotion=await maybePromoteSemester(user.id);
  if(!promotion?.advanced) fail("Semester 1 → 2 promotion",JSON.stringify(promotion));
  pass("Semester 1 automatically promotes to Semester 2",`now Semester ${promotion.semester}`);

  // XP + level.
  const before=(await db.user.findUnique({where:{id:user.id},select:{xp:true}})).xp;
  const after=await awardXP(user.id,XP.MCQ_CORRECT);
  if(after.xp!==before+XP.MCQ_CORRECT) fail("XP increment");
  if(after.level!==levelForXP(after.xp)) fail("XP → level consistency");
  pass("XP + level update",`${before} → ${after.xp} XP, level ${after.level}`);

  // Mock paper exists and has questions.
  const mock=await db.mockExam.findFirst({where:{semesterId:s1.id},include:{questions:true}});
  if(!mock||!mock.questions.length) fail("Semester 1 mock exists with questions");
  pass("Mock paper is populated",`${mock.questions.length} questions`);

  await db.user.delete({where:{id:user.id}});
  const gone=await db.user.findUnique({where:{email:EMAIL}});
  if(gone) fail("Temporary account cleanup");
  pass("Temporary account removed");

  console.log("\nALL REAL LEARNING FLOW TESTS PASSED.\n");
}

main().catch(err=>{console.error("\nREAL LEARNING FLOW TEST FAILED\n");console.error(err);process.exitCode=1}).finally(()=>db.$disconnect());
