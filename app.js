const nodes = {
  brief: {
    title: "Creative Brief",
    text: "I extracted 8 production constraints from your brief and used them to build the workflow.",
    body: `<div class="constraint-list">
      <div><span>✓</span> 30-second hero film</div>
      <div><span>✓</span> 16:9 + 9:16 outputs</div>
      <div><span>✓</span> Dark editorial aesthetic</div>
      <div><span>✓</span> Warm gold accent palette</div>
      <div><span>✓</span> One consistent lead</div>
      <div><span>✓</span> Macro product photography</div>
      <div><span>✓</span> No text before end card</div>
    </div>`
  },
  concept: {
    title: "Concept Director",
    text: "Creates 3 directions from the brief, then scores them against brand fit, novelty and production feasibility.",
    body: `<div class="constraint-list"><div><span>1</span> Midnight Ritual — 94% fit</div><div><span>2</span> Liquid Gold — 89% fit</div><div><span>3</span> After Hours Lab — 84% fit</div></div>`
  },
  brand: {
    title: "Brand Lock",
    text: "Persistent production rules travel downstream so every generation receives the same visual constraints.",
    body: `<div class="constraint-list"><div><span>◆</span> Ink black / warm gold palette</div><div><span>◆</span> High contrast, low-key lighting</div><div><span>◆</span> Premium editorial framing</div><div><span>◆</span> No text before end card</div></div>`
  },
  story: {
    title: "Storyboard",
    text: "FlowPilot converts the selected direction into a timed shot plan before expensive video generation begins.",
    body: `<div class="constraint-list"><div><span>01</span> Macro serum texture — 3s</div><div><span>02</span> Lead enters shadow — 5s</div><div><span>03</span> Product ritual — 6s</div><div><span>04</span> Portrait / glow — 5s</div><div><span>05</span> Bottle hero — 7s</div><div><span>06</span> End card — 4s</div></div>`
  },
  image: {
    title: "Hero Frames",
    text: "Routes each shot to the model best suited to it instead of forcing one model across the whole campaign.",
    body: `<div class="constraint-list"><div><span>◩</span> Shot 01 → high-detail image model</div><div><span>◩</span> Shot 04 → portrait-optimized model</div><div><span>◩</span> Shot 05 → product-photography model</div></div>`
  },
  character: {
    title: "Character Lock",
    text: "Creates a reusable identity reference for downstream image and video nodes.",
    body: `<div class="constraint-list"><div><span>✓</span> Face reference locked</div><div><span>✓</span> Hair + wardrobe locked</div><div><span>✓</span> Skin tone tolerance set</div><div><span>!</span> Shot 04 confidence below threshold</div></div>`
  },
  video: {
    title: "Video Shots",
    text: "Generates shot-by-shot, preserving the storyboard and guardrails while choosing the best model per scene.",
    body: `<div class="constraint-list"><div><span>▶</span> Shots 01–03 ready</div><div><span>▶</span> Shot 04 flagged for drift</div><div><span>▶</span> Shot 05 flagged for text</div><div><span>▶</span> Shot 06 ready</div></div>`
  },
  qa: {
    title: "Creative QA",
    text: "Checks the outputs against the original brief before a creator spends time reviewing every shot manually.",
    body: `<div class="constraint-list"><div><span>96</span> Brand match</div><div><span>92</span> Brief adherence</div><div><span>71</span> Character consistency</div><div><span>89</span> Technical specs</div></div>`
  }
};

const title = document.getElementById("inspectTitle");
const content = document.getElementById("inspectorContent");
const toast = document.getElementById("toast");

function showToast(msg){
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"), 2200);
}

document.querySelectorAll(".node").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".node").forEach(n=>n.classList.remove("selected"));
    btn.classList.add("selected");
    const d = nodes[btn.dataset.node];
    title.textContent = d.title;
    content.innerHTML = `<p class="agent-text">${d.text}</p>${d.body}`;
  })
});

document.getElementById("buildBtn").addEventListener("click", ()=>{
  showToast("Workflow rebuilt from the creative brief");
  document.querySelectorAll(".node").forEach((n,i)=>{
    n.animate([{opacity:.2, transform:"translateY(8px)"},{opacity:1, transform:"translateY(0)"}],{duration:300+i*70,fill:"both"});
  });
});

document.getElementById("runQaBtn").addEventListener("click", ()=>{
  const panel = document.getElementById("qaPanel");
  panel.classList.remove("hidden");
  panel.scrollIntoView({behavior:"smooth",block:"start"});
  showToast("Creative QA complete — 2 issues found");
});

document.querySelectorAll(".fix-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const type = btn.dataset.fix;
    if(type==="character"){
      title.textContent = "Agent Fix — Character Drift";
      content.innerHTML = `<p class="agent-text">Shot 04 differs from the locked lead reference. I can preserve the composition while regenerating identity-sensitive details.</p>
      <div class="constraint-list"><div><span>✓</span> Reapply face reference</div><div><span>✓</span> Lock black silk wardrobe</div><div><span>✓</span> Preserve camera + lighting</div></div>
      <button class="primary" id="regen04" style="margin-top:14px;width:100%">Regenerate Shot 04</button>`;
    } else {
      title.textContent = "Agent Fix — Unintended Text";
      content.innerHTML = `<p class="agent-text">Shot 05 violates the brief because packaging text appears before the end card.</p>
      <div class="constraint-list"><div><span>✓</span> Add negative text constraint</div><div><span>✓</span> Preserve bottle geometry</div><div><span>✓</span> Preserve macro lighting</div></div>
      <button class="primary" id="regen05" style="margin-top:14px;width:100%">Regenerate Shot 05</button>`;
    }
    document.querySelector(".inspector").scrollIntoView({behavior:"smooth",block:"center"});
    setTimeout(()=>{
      const r4=document.getElementById("regen04");
      if(r4) r4.addEventListener("click",()=>{
        content.innerHTML = `<p class="agent-text">Targeted regeneration complete.</p>
        <div class="constraint-list"><div><span>✓</span> Face reference restored</div><div><span>✓</span> Wardrobe matches locked reference</div><div><span>✓</span> Camera + lighting preserved</div><div><span>94</span> Character consistency after fix</div></div>
        <div class="success-card"><strong>Shot 04 is ready for review</strong><span>Only the flagged shot was regenerated.</span></div>`;
        showToast("Shot 04 regenerated — consistency improved");
      });
      const r5=document.getElementById("regen05");
      if(r5) r5.addEventListener("click",()=>{
        content.innerHTML = `<p class="agent-text">Targeted regeneration complete.</p>
        <div class="constraint-list"><div><span>✓</span> Unintended packaging text removed</div><div><span>✓</span> Bottle geometry preserved</div><div><span>✓</span> Macro lighting preserved</div></div>
        <div class="success-card"><strong>Shot 05 is ready for review</strong><span>The brief's no-text rule is now satisfied.</span></div>`;
        showToast("Shot 05 regenerated — text issue resolved");
      });
    },0);
  })
});

document.getElementById("agentSend").addEventListener("click", ()=>{
  const input = document.getElementById("agentInput");
  if(!input.value.trim()) return;
  const q = input.value.trim();
  title.textContent = "Workflow Updated";
  content.innerHTML = `<p class="agent-text">I interpreted your request:</p><div class="constraint-list"><div><span>✦</span> ${q.replace(/[<>]/g,"")}</div></div><p class="agent-text">Prototype behavior: the production version would translate this into node and parameter changes.</p>`;
  input.value="";
  showToast("Agent applied the requested workflow change");
});

document.getElementById("agentInput").addEventListener("keydown", e=>{
  if(e.key==="Enter") document.getElementById("agentSend").click();
});

document.getElementById("resetBtn").addEventListener("click", ()=>location.reload());
