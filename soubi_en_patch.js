(function () {
  const replacements = new Map([
    ["装備入力ツール","Spec Input Tool"],["装備入力","Spec Input"],["スペック入力","Spec Input"],["仕様入力","Spec Input"],
    ["装備を選択してください","Select specs below"],["必要な装備を選んでください","Select the required specs"],["下のボタンを押して追加","Tap buttons below to add"],
    ["手動入力","Manual Input"],["手動入力欄","Manual Input"],["自由入力","Free Input"],["コピー","Copy"],["全削除","Clear All"],["削除","Delete Last"],["クリア","Clear"],["アンドゥ","Undo"],["やり直し","Redo"],["並び替え","Sort"],["幅を揃える","Align Width"],["幅を自動調整","Auto Width"],
    ["コピーしました","Copied!"],["削除しました","Deleted."],["最後の項目を削除しました","Deleted the last item."],["全てクリアしました","Cleared all."],["重複です","Duplicate."],["すでに追加されています","Already added."],["入力してください","Please enter a value."],
    ["全削除しますか？","Clear all specs?"],["本当に削除しますか？","Delete this item?"],
    ["選択中","Selected"],["結果","Result"],["装備一覧","Spec List"],["コピー用テキスト","Text to Copy"]
  ]);
  const placeholderReplacements = new Map([
    ["ここに入力","Type here"],["手入力で追加","Add manually"],["検索","Search"]
  ]);
  function translateTextNodes(root){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
      const t=node.nodeValue && node.nodeValue.trim(); if(!t) return NodeFilter.FILTER_REJECT;
      for (const [jp] of replacements){ if(t.includes(jp)) return NodeFilter.FILTER_ACCEPT;}
      return NodeFilter.FILTER_REJECT;}});
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes){ let v=node.nodeValue; for(const [jp,en] of replacements){ if(v.includes(jp)) v=v.split(jp).join(en);} node.nodeValue=v; }
  }
  function translateAttributes(){
    const all=document.querySelectorAll('[placeholder], input, textarea');
    for(const el of all){
      const ph=el.getAttribute('placeholder');
      if(ph){ for(const [jp,en] of placeholderReplacements){ if(ph.includes(jp)) el.setAttribute('placeholder', ph.split(jp).join(en));}}
      const aria=el.getAttribute('aria-label');
      if(aria){ for(const [jp,en] of replacements){ if(aria.includes(jp)) el.setAttribute('aria-label', aria.split(jp).join(en));}}
    }
  }
  function translateTitle(){
    if(document.title && /装備|スペック|仕様/.test(document.title)){
      document.title=document.title.replace(/装備入力ツール/g,"Spec Input Tool").replace(/装備入力|スペック入力|仕様入力/g,"Spec Input");
    }
    document.querySelectorAll('h1,h2,header .title,.page-title').forEach(h=>{
      if(h.textContent.includes("装備入力ツール")) h.textContent=h.textContent.replace("装備入力ツール","Spec Input Tool");
      else if(/装備入力|スペック入力|仕様入力/.test(h.textContent)) h.textContent=h.textContent.replace(/装備入力|スペック入力|仕様入力/g,"Spec Input");
    });
  }
  function run(){ translateTitle(); translateTextNodes(document.body); translateAttributes(); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", run); else run();
})();
