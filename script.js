// ---------------- LOGIN ----------------
let student = "", attempts = 0;

function login(){
  student = document.getElementById("username").value || "Student";
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("app").style.display = "block";
}

function logout(){
  document.getElementById("app").style.display = "none";
  document.getElementById("loginPage").style.display = "flex";
}

// ---------------- NAVIGATION ----------------
function showPage(page){
  let c = document.getElementById("content");

  if(page === "home"){
    c.innerHTML = `<div class="card"><h2>🏠 Home</h2><p>Welcome back, ${student}!</p></div>`;
  }

  if(page === "dashboard"){
    c.innerHTML = `
      <div class="card">
        <h2>📊 Dashboard</h2>
        <p><b>Assessments Taken:</b> ${attempts}</p>
        <p><b>Current Adaptive Level:</b> ${level}</p>
        <p><b>Questions Attempted:</b> ${questionCount}/20</p>
      </div>`;
  }

  if(page === "profile") showProfile();
  if(page === "assessment") startQuiz();
}

// ---------------- QUESTIONS ----------------
let questions = [
  {sub:"Programming Basics",lvl:2,q:"Which data type stores true/false?",o:["int","boolean","float"],a:1},
  {sub:"Programming Basics",lvl:2,q:"Which symbol is used for comments in Java?",o:["#","//","<!-- -->"],a:1},
  {sub:"Java",lvl:2,q:"Entry point of Java program?",o:["start()","main()","run()"],a:1},
  {sub:"Java",lvl:3,q:"Which keyword is used for inheritance?",o:["this","extends","implements"],a:1},
  {sub:"Python",lvl:2,q:"Which keyword defines a function?",o:["def","func","define"],a:0},
  {sub:"Python",lvl:3,q:"Which is immutable?",o:["List","Set","Tuple"],a:2},
  {sub:"C",lvl:2,q:"Which symbol ends a statement?",o:[".",";"," :"],a:1},
  {sub:"C",lvl:3,q:"Which function allocates memory dynamically?",o:["malloc()","alloc()","new()"],a:0},
  {sub:"HTML",lvl:2,q:"Which tag creates a hyperlink?",o:["<link>","<a>","<href>"],a:1},
  {sub:"CSS",lvl:3,q:"Which property changes text color?",o:["font-color","color","text-style"],a:1},
  {sub:"SQL",lvl:2,q:"Command to fetch data?",o:["GET","SELECT","FETCH"],a:1},
  {sub:"SQL",lvl:3,q:"Clause to filter records?",o:["WHERE","ORDER BY","GROUP BY"],a:0},
];

// ---------------- ADAPTIVE ENGINE ----------------
let level = 2, score = 0;
let performance = {}, currentQuestion = null;
let questionCount = 0;
const MAX_QUESTIONS = 20;

function startQuiz(){
  level = 2;
  score = 0;
  performance = {};
  questionCount = 0;
  loadQuestion();
}

function loadQuestion(){
  if(questionCount >= MAX_QUESTIONS){
    showResult();
    return;
  }

  let pool = questions.filter(q => q.lvl >= level);
  currentQuestion = pool[Math.floor(Math.random()*pool.length)];

  if(!performance[currentQuestion.sub]){
    performance[currentQuestion.sub] = {correct:0,total:0};
  }

  document.getElementById("content").innerHTML = `
    <div class="card">
      <h2>🧠 ${currentQuestion.sub} | Level ${level}</h2>
      <p>Question ${questionCount+1} of 20</p>
      <p>${currentQuestion.q}</p>
      ${currentQuestion.o.map((x,i)=>`
        <button class="option-btn" onclick="answer(${i})">${x}</button>
      `).join("")}
    </div>`;
}

function answer(choice){
  let sub = currentQuestion.sub;
  performance[sub].total++;
  questionCount++;

  if(choice === currentQuestion.a){
    score++;
    performance[sub].correct++;
    level = Math.min(level+1,3);
  } else {
    level = Math.max(level-1,2);
  }
  loadQuestion();
}

// ---------------- RESULT & PROFILE ----------------
function showResult(){
  attempts++;
  showProfile();
}

function showProfile(){
  let strengths=[], weaknesses=[], mastery=[];

  for(let sub in performance){
    let acc = (performance[sub].correct / performance[sub].total) * 100;
    if(acc >= 70){
      strengths.push(sub);
      mastery.push(`${sub}: High Mastery`);
    } else {
      weaknesses.push(sub);
      mastery.push(`${sub}: Developing`);
    }
  }

  document.getElementById("content").innerHTML = `
    <div class="card">
      <h2>🎯 Student Performance Profile</h2>
      <p><b>Name:</b> ${student}</p>
      <p><b>Score:</b> ${score}/20</p>
      <p><b>Final Level:</b> ${level}</p>
      <p><b>Strengths:</b> ${strengths.join(", ") || "None"}</p>
      <p><b>Weaknesses:</b> ${weaknesses.join(", ") || "None"}</p>
      <h3>📊 Mastery</h3>
      <ul>${mastery.map(m=>`<li>${m}</li>`).join("")}</ul>
      <button onclick="startQuiz()">Restart Assessment</button>
    </div>`;
}