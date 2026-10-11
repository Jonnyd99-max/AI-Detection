import mammoth from 'mammoth/mammoth.browser.js';
import DOMPurify from 'dompurify';
import JSZip from 'jszip';
import {Document,Packer,Paragraph,TextRun,HeadingLevel} from 'docx';
export function sanitize(html){return DOMPurify.sanitize(html,{ALLOWED_TAGS:['p','h1','h2','h3','h4','h5','h6','strong','b','em','i','ul','ol','li','br'],ALLOWED_ATTR:[]});}
export async function importWord(file){
 if(/\.doc$/i.test(file.name))throw Error('Older .doc files are not supported. Save as .docx in Microsoft Word first.');
 if(!/\.docx$/i.test(file.name))throw Error('Choose a Microsoft Word .docx file.');
 if(file.size>10*1024*1024)throw Error('The upload limit is 10 MB. Please use a smaller document.');
 const arrayBuffer=await file.arrayBuffer();let zip;try{zip=await JSZip.loadAsync(arrayBuffer);}catch{throw Error('This file is not a readable Word document. It may be damaged or encrypted.');}
 const entries=Object.values(zip.files);const expanded=entries.reduce((sum,e)=>sum+(e._data?.uncompressedSize||0),0);if(entries.length>2000||expanded>30*1024*1024)throw Error('The document is too large when expanded (30 MB limit).');
 const part=zip.file('word/document.xml');if(!part)throw Error('This archive does not contain a Word document.');
 const xml=await part.async('string');const warnings=[];
 const checks=[[/<(?:\w+:)?tbl\b/,'tables'],[/<(?:\w+:)?(?:drawing|pict)\b/,'images'],[/<(?:\w+:)?(?:ins|del|moveFrom|moveTo)\b/,'tracked changes'],[/<(?:\w+:)?commentRangeStart\b/,'comments'],[/<(?:\w+:)?(?:footnoteReference|endnoteReference)\b/,'footnotes or endnotes'],[/<(?:\w+:)?hyperlink\b/,'hyperlinks'],[/<(?:\w+:)?(?:fldChar|fldSimple)\b/,'fields']];
 for(const [re,label]of checks)if(re.test(xml))warnings.push(label);
 if(entries.some(e=>/^word\/(header|footer)\d*\.xml$/.test(e.name)))warnings.push('headers or footers');
 const result=await mammoth.convertToHtml({arrayBuffer},{convertImage:mammoth.images.imgElement(()=>Promise.resolve({src:''})),externalFileAccess:false});
 const html=sanitize(result.value);if(html.length>1_000_000)throw Error('The extracted document is too large to edit safely.');
 return {html,warnings:[...warnings,...result.messages.map(m=>m.message)],notice:'Only headings, paragraphs, bold, italic and lists are retained. Page layout, fonts, colours and other Word features are not preserved.'};
}
function runs(node){if(node.type==='text')return[new TextRun({text:node.text,bold:node.marks?.some(m=>m.type==='bold'),italics:node.marks?.some(m=>m.type==='italic')})];if(node.type==='hardBreak')return[new TextRun({break:1})];return(node.content||[]).flatMap(runs);}
export async function exportWord(json){const children=[];let numbering=0;const configs=[];function visit(node,list=null,level=0){if(['paragraph','heading'].includes(node.type)){children.push(new Paragraph({children:runs(node),heading:node.type==='heading'?HeadingLevel[`HEADING_${node.attrs.level}`]:undefined,...(list?.type==='bullet'?{bullet:{level}}:list?{numbering:{reference:list.ref,level}}:{})}));}else if(node.type==='bulletList'||node.type==='orderedList'){const ref=`list-${numbering++}`;if(node.type==='orderedList')configs.push({reference:ref,levels:Array.from({length:9},(_,i)=>({level:i,format:'decimal',text:`%${i+1}.`,alignment:'left',start:node.attrs?.start||1,style:{paragraph:{indent:{left:720*(i+1),hanging:260}}}}))});for(const li of node.content||[])for(const block of li.content||[])visit(block,{type:node.type==='bulletList'?'bullet':'number',ref},list?Math.min(level+1,8):0);}else for(const child of node.content||[])visit(child,list,level);}visit(json);return Packer.toBlob(new Document({numbering:{config:configs},sections:[{children:children.length?children:[new Paragraph('')]}]}));}
