"""Editable, reproducible Aletheia AI stationery and company collateral.
Run with Python 3 + reportlab + pypdf. Typography: Barlow Condensed + Arial.
"""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.utils import ImageReader
from pypdf import PdfReader, PdfWriter
from pypdf.generic import RectangleObject

OUT=Path(__file__).resolve().parent
LOGO=OUT/'assets/aletheia-ai-logo.png'
pdfmetrics.registerFont(TTFont('Display',str(OUT/'assets/BarlowCondensed-ExtraBold.ttf')))
pdfmetrics.registerFont(TTFont('Body','/System/Library/Fonts/Supplemental/Arial.ttf'))
pdfmetrics.registerFont(TTFont('BodyBold','/System/Library/Fonts/Supplemental/Arial Bold.ttf'))
PAPER='#F4F1E9'; INK='#17191C'; BLUE='#2448FF'; CORAL='#FF775E'; MUTED='#5A5C63'; LINE='#CDCAC3'
W,H=595.276,841.89
M=42

def bg(c,color=PAPER,w=W,h=H):
 c.setFillColor(HexColor(color)); c.rect(0,0,w,h,fill=1,stroke=0)
def text(c,s,x,y,size=12,font='Body',color=INK):
 c.setFillColor(HexColor(color));c.setFont(font,size);c.drawString(x,y,s)
def para(c,s,x,y,w,size=11.5,leading=16,color=INK,font='Body'):
 style=ParagraphStyle('body',fontName=font,fontSize=size,leading=leading,textColor=HexColor(color),spaceAfter=0)
 p=Paragraph(s,style);aw,ah=p.wrap(w,1000);p.drawOn(c,x,y-ah);return y-ah

def rule(c,y,x=M,w=W-2*M,color=LINE):
 c.setStrokeColor(HexColor(color));c.setLineWidth(.55);c.line(x,y,x+w,y)
def logo(c,x=M,y=741,w=180):
 c.drawImage(str(LOGO),x,y,width=w,height=w*733/2144,mask='auto')
def label(c,s,x,y,color=MUTED,size=8.5):
 text(c,s.upper(),x,y,size,'BodyBold',color)
def footer(c,n,title):
 rule(c,39);label(c,'ALETHEIA AI / '+title,M,24,size=7.3);text(c,f'{n:02}',W-M-12,24,8.5,'BodyBold');
 c.linkURL('https://aletheiaai.tech',(M,17,230,34),relative=0,thickness=0)
def header(c,section):
 bg(c);logo(c,y=744,w=158);label(c,section,330,775);rule(c,740)
def new_pdf(name,title,pagesize=(W,H)):
 c=canvas.Canvas(str(OUT/name),pagesize=pagesize,pageCompression=1)
 c.setTitle(title);c.setAuthor('Aletheia AI');c.setSubject('Aletheia AI company collateral');return c

def bands(c,x,y,scale=1):
 # Editorial geometry: open diagonal lanes, not a substitute logo.
 c.saveState();c.translate(x,y);c.scale(scale,scale)
 for i,color in enumerate([BLUE,BLUE,CORAL]):
  c.setFillColor(HexColor(color));p=c.beginPath();p.moveTo(i*92,0);p.lineTo(i*92+58,0);p.lineTo(i*92+206,225);p.lineTo(i*92+148,225);p.close();c.drawPath(p,fill=1,stroke=0)
 c.restoreState()

services=[
 ('AI Product Engineering','LLM applications, agent systems, RAG pipelines and computer vision. From architecture to a working product.'),
 ('MVP & Rapid Prototyping','Turn a promising idea into a focused product you can put in front of real users.'),
 ('Full-Stack Development','Websites, web applications, APIs and real-time systems. A complete experience, from interface to infrastructure.'),
 ('Cybersecurity & Auditing','Security audits, penetration testing, vulnerability assessments and secure architecture design.'),
 ('Blockchain & Web3','Smart contracts, decentralised applications and token systems, connected to usable product experiences.'),
 ('Data Engineering & ML','Data pipelines, model development and MLOps. The foundations for reliable intelligent applications.'),
]
projects=[
 ('HeuriSight','AI ASSESSMENT PLATFORM','Combining document understanding and heuristic reasoning to connect student work with educational competencies.','heurisight-rag'),
 ('RD Fitness','WEBSITE & MEMBERSHIP PLATFORM','A responsive fitness platform connecting brand storytelling, membership registration and class booking.','rd-fitness-platform'),
 ('CodeCraft','AI DEVELOPER TOOL','A command-line coding assistant with role-based reasoning, project rules and safeguards for development workflows.','codecraft-cli'),
 ('Inscrape','PYTHON DATA SDK','A developer toolkit for structured web extraction, Markdown output and screenshots with asynchronous support.','inscrape-sdk'),
]
products=[('Inscrape','Structured web data. Less friction.','A Python SDK for intelligent web extraction.'),('Nirvana','Bring clarity to the alert inbox.','Deduplicate, route and prioritise monitoring alerts.'),('SwarmScope','Explore complex systems.','Multi-agent simulations from unstructured data.')]

# COMPANY BROCHURE: four A4 pages, intended for digital sharing.
c=new_pdf('aletheia-ai-brochure.pdf','Aletheia AI | Company brochure')
bg(c);logo(c,y=736,w=213);label(c,'COMPANY BROCHURE / 2026',355,779);rule(c,730)
text(c,'INTELLIGENCE.',M,613,93,'Display')
text(c,'PUT TO WORK.',M,521,93,'Display',BLUE)
para(c,'AI systems, websites and software.<br/>Built around your business.',M,474,390,19,25)
label(c,'AI / WEB / SOFTWARE / SECURITY / DATA / WEB3',M,371,INK)
# Full bleed quiet graphic area
c.saveState(); p=c.beginPath();p.rect(0,67,W,267);c.clipPath(p,stroke=0,fill=0);bands(c,214,49,1.2);c.restoreState()
para(c,'A clear idea.<br/>A considered build.<br/>Something that works.',M,252,200,22,29,font='Display')
text(c,'aletheiaai.tech',M,89,12,'BodyBold');c.linkURL('https://aletheiaai.tech',(M,81,190,108),relative=0)
footer(c,1,'COMPANY BROCHURE');c.showPage()
header(c,'01 / CAPABILITIES');text(c,'WHAT WE BUILD.',M,662,67,'Display')
para(c,'One technology partner. A broad set of capabilities.',M,628,470,13,18,color=MUTED)
y=566
for i,(name,desc) in enumerate(services):
 rule(c,y+18);label(c,f'0{i+1}',M,y-4,BLUE,10);text(c,name,84,y-6,25,'Display');para(c,desc,84,y-24,448,11.4,15.4,color=MUTED);y-=82
footer(c,2,'CAPABILITIES');c.showPage()
header(c,'02 / SELECTED WORK');text(c,'WORK THAT',M,662,68,'Display');text(c,'MAKES IT REAL.',M,595,68,'Display',BLUE)
y=545
for i,(name,cat,desc,slug) in enumerate(projects):
 rule(c,y+6);label(c,cat,M,y-17,BLUE,8);text(c,name,M,y-61,39,'Display');para(c,desc,272,y-24,275,11.4,15.5)
 text(c,'View case study  >',272,y-85,9,'BodyBold',BLUE);c.linkURL('https://aletheiaai.tech/case-studies/'+slug,(269,y-91,403,y-72),relative=0)
 y-=119
footer(c,3,'SELECTED WORK');c.showPage()
header(c,'03 / OUR PRODUCTS');text(c,'BUILT HERE.',M,662,67,'Display')
text(c,'Tools shaped by real engineering work.',M,625,13,'Body',MUTED)
y=568
for name,tag,desc in products:
 rule(c,y+16);text(c,name,M,y-17,33,'Display');text(c,tag,241,y-7,12,'BodyBold');para(c,desc,241,y-21,305,11.2,15,color=MUTED);y-=82
c.setFillColor(HexColor(BLUE));c.rect(0,61,W,263,fill=1,stroke=0)
label(c,'START WITH THE PROBLEM',M,293,PAPER)
text(c,"LET'S BUILD",M,219,66,'Display',PAPER);text(c,'WHAT COMES NEXT.',M,155,66,'Display',PAPER)
text(c,'info@aletheiaai.tech',M,102,15,'BodyBold',PAPER);text(c,'aletheiaai.tech',365,104,12,'Body',PAPER)
c.linkURL('mailto:info@aletheiaai.tech',(M,91,245,120),relative=0);c.linkURL('https://aletheiaai.tech/contact',(362,94,545,120),relative=0)
footer(c,4,'CONTACT');c.save()

# BUSINESS CARD: 90 x 50 mm trim; 3 mm bleed all sides, two PDF pages.
mm=72/25.4;trimW=90*mm;trimH=50*mm;bleed=3*mm;cw=trimW+2*bleed;ch=trimH+2*bleed
c=new_pdf('aletheia-ai-business-card-print.pdf','Aletheia AI | Ganesh Khetawat business card',(cw,ch))
bg(c,PAPER,cw,ch)
logo(c,23,73,194)
text(c,'INTELLIGENCE. PUT TO WORK.',26,44,12,'Display',BLUE)
c.setFillColor(HexColor(CORAL));c.rect(cw-18,0,18,ch,fill=1,stroke=0)
c.showPage();bg(c,PAPER,cw,ch)
c.setFillColor(HexColor(BLUE));c.rect(0,ch-18,cw,18,fill=1,stroke=0)
text(c,'Ganesh Khetawat',23,108,23,'Display')
text(c,'Founder & CEO',23,92,8.7,'Body',MUTED)
rule(c,77,23,cw-46)
text(c,'info@aletheiaai.tech',23,57,9.3,'BodyBold');text(c,'aletheiaai.tech',23,40,9.3,'Body')
label(c,'AI / WEB / SOFTWARE',23,24,BLUE,6.7)
c.linkURL('mailto:info@aletheiaai.tech',(20,52,166,69),relative=0);c.linkURL('https://aletheiaai.tech',(20,34,166,47),relative=0);c.save()
path=OUT/'aletheia-ai-business-card-print.pdf'; reader=PdfReader(path);writer=PdfWriter()
for page in reader.pages:
 page.trimbox=RectangleObject([bleed,bleed,cw-bleed,ch-bleed]);page.bleedbox=RectangleObject([0,0,cw,ch]);writer.add_page(page)
writer.add_metadata({'/Title':'Aletheia AI | Business card | 90 x 50 mm + 3 mm bleed','/Author':'Aletheia AI'})
with path.open('wb') as f:writer.write(f)

# COMPANY PROFILE & BRAND REFERENCE: 2 pages
c=new_pdf('aletheia-ai-company-profile-and-brand-guide.pdf','Aletheia AI | Company profile and brand reference')
header(c,'COMPANY PROFILE');text(c,'A CLEARER WAY',M,666,67,'Display');text(c,'TO BUILD.',M,599,67,'Display',BLUE)
para(c,'Aletheia AI builds AI systems, websites and software around business needs. Our work brings product thinking, interface design and engineering into one delivery process.',M,563,495,16,22)
label(c,'CAPABILITIES',M,443,BLUE)
y=418
for i,(name,desc) in enumerate(services):text(c,name,M,y-i*25,12.5,'Body')
rule(c,250)
label(c,'LEADERSHIP',M,224,BLUE);text(c,'Ganesh Khetawat',M,193,26,'Display');text(c,'Founder & CEO',M,173,11,'Body',MUTED)
label(c,'PRODUCTS',320,224,BLUE);text(c,'Inscrape / Nirvana / SwarmScope',320,195,10.8,'Body')
label(c,'CONTACT',M,127,BLUE);text(c,'info@aletheiaai.tech',M,102,13,'BodyBold');text(c,'aletheiaai.tech',320,102,12,'Body')
c.linkURL('mailto:info@aletheiaai.tech',(M,95,240,115),relative=0);c.linkURL('https://aletheiaai.tech',(318,95,530,115),relative=0)
footer(c,1,'COMPANY PROFILE');c.showPage()
header(c,'BRAND REFERENCE / V1');text(c,'CLARITY. WITH',M,666,65,'Display');text(c,'CHARACTER.',M,601,65,'Display',BLUE)
label(c,'01 / COLOUR',M,558,BLUE)
colors=[('IVORY',PAPER),('COBALT',BLUE),('CORAL',CORAL),('INK',INK)]
for i,(name,color) in enumerate(colors):
 x=M+i*130;c.setFillColor(HexColor(color));c.setStrokeColor(HexColor(LINE));c.rect(x,478,115,57,fill=1,stroke=1)
 label(c,name,x,461,size=8);text(c,color,x,446,9,'Body')
label(c,'02 / TYPE',M,399,BLUE);text(c,'BARLOW CONDENSED',M,360,35,'Display');para(c,'ExtraBold headlines. Sentence-case body copy in the website body font; Arial is the portable stationery fallback.',M,338,492,11.5,16)
label(c,'03 / LOGO',M,278,BLUE)
para(c,'Use the approved full-colour lockup on ivory or white. Keep its proportions and leave clear space around it. Do not stretch, recolour, add effects or place it over busy artwork.',M,259,490,11.5,16)
label(c,'04 / VOICE',M,183,BLUE)
para(c,'Clear, useful and direct. Start with the business need, explain the work, then show evidence. Use real projects and precise descriptions. Avoid inflated claims and invented performance numbers.',M,164,490,11.5,16)
text(c,'Core message: Intelligence. Put to work.',M,83,12,'BodyBold')
footer(c,2,'BRAND REFERENCE');c.save()

# BLANK LETTERHEAD: operational company document template.
c=new_pdf('aletheia-ai-letterhead.pdf','Aletheia AI | Letterhead template')
bg(c,'#FFFFFF');logo(c,y=741,w=205);label(c,'AI / WEB / SOFTWARE',M,719,BLUE,8);rule(c,698)
c.setFillColor(HexColor(CORAL));c.rect(W-18,737,18,105,fill=1,stroke=0)
rule(c,74);text(c,'Aletheia AI',M,52,10,'BodyBold');text(c,'info@aletheiaai.tech',230,52,9,'Body');text(c,'aletheiaai.tech',W-M-100,52,9,'Body')
c.linkURL('mailto:info@aletheiaai.tech',(229,46,353,65),relative=0);c.linkURL('https://aletheiaai.tech',(W-M-103,46,W-M+2,65),relative=0)
c.save()
print('Created four PDF documents in',OUT)
