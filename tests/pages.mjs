import {createServer} from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const root=path.resolve('dist');
const server=createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');if(!url.pathname.startsWith('/AI-Detection/')){res.writeHead(404);res.end();return;}const relative=decodeURIComponent(url.pathname.slice('/AI-Detection/'.length))||'index.html';const file=path.resolve(root,relative);if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}const content=await fs.readFile(file);res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(content);}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(5174,'127.0.0.1',r));
const browser=await chromium.launch({channel:'msedge',headless:true});
try{const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});await page.goto('http://127.0.0.1:5174/AI-Detection/');await page.getByRole('button',{name:'Load demo'}).click();assert.ok(await page.locator('.finding').count()>0);assert.equal(await page.locator('.workspace').evaluate(el=>getComputedStyle(el).display),'grid');assert.deepEqual(errors,[]);console.log('Production assets and editor work under /AI-Detection/ with no failed requests or runtime errors.');}finally{await browser.close();server.close();}
