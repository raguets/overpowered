#!/usr/bin/env python3
from pathlib import Path
import json, re, sys
try:
    import yaml
except ImportError:
    print("ERROR: PyYAML is required: pip install pyyaml", file=sys.stderr)
    raise

ROOT = Path(__file__).resolve().parents[1]
SKILLS = ROOT / "skills"
NAME_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
REF_RE = re.compile(r"(?:\[[^\]]*\]\()?((?:references|assets|scripts|evals)/[A-Za-z0-9_.-]+\.(?:md|yaml|yml|json|py|sh|js|ts|txt|csv))\)?")
errors=[]
warnings=[]

skill_dirs=sorted(p for p in SKILLS.iterdir() if p.is_dir())
if not skill_dirs:
    errors.append("No skill directories found")

for d in skill_dirs:
    f=d/"SKILL.md"
    if not f.exists():
        errors.append(f"{d.name}: missing SKILL.md")
        continue
    text=f.read_text(encoding='utf-8')
    lines=text.splitlines()
    if len(lines) >= 500:
        warnings.append(f"{d.name}: SKILL.md has {len(lines)} lines (recommended <500)")
    if not text.startswith('---\n'):
        errors.append(f"{d.name}: missing YAML frontmatter opener")
        continue
    try:
        _, fm, body = text.split('---',2)
        meta=yaml.safe_load(fm)
    except Exception as e:
        errors.append(f"{d.name}: invalid frontmatter: {e}")
        continue
    name=meta.get('name') if isinstance(meta,dict) else None
    desc=meta.get('description') if isinstance(meta,dict) else None
    if name != d.name:
        errors.append(f"{d.name}: frontmatter name {name!r} does not match directory")
    if not isinstance(name,str) or len(name)>64 or not NAME_RE.match(name or ''):
        errors.append(f"{d.name}: invalid Agent Skills name")
    if not isinstance(desc,str) or not desc.strip():
        errors.append(f"{d.name}: missing/empty description")
    elif len(desc)>1024:
        errors.append(f"{d.name}: description exceeds 1024 chars ({len(desc)})")
    comp=meta.get('compatibility') if isinstance(meta,dict) else None
    if isinstance(comp,str) and len(comp)>500:
        errors.append(f"{d.name}: compatibility exceeds 500 chars ({len(comp)})")
    for rel in REF_RE.findall(body):
        rel=rel.rstrip('.,;:')
        p=d/rel
        if not p.exists():
            errors.append(f"{d.name}: referenced local file missing: {rel}")
    ef=d/'evals'/'evals.json'
    if not ef.exists():
        errors.append(f"{d.name}: missing evals/evals.json")
    else:
        try:
            data=json.loads(ef.read_text(encoding='utf-8'))
            if data.get('skill_name') != d.name:
                errors.append(f"{d.name}: eval skill_name mismatch")
            evs=data.get('evals')
            if not isinstance(evs,list) or len(evs)<2:
                errors.append(f"{d.name}: expected at least 2 evals")
            else:
                ids=set()
                for i,e in enumerate(evs,1):
                    if e.get('id') in ids: errors.append(f"{d.name}: duplicate eval id {e.get('id')}")
                    ids.add(e.get('id'))
                    for k in ('id','prompt','expected_output','assertions'):
                        if k not in e: errors.append(f"{d.name}: eval {i} missing {k}")
                    if not isinstance(e.get('assertions'),list) or not e.get('assertions'):
                        errors.append(f"{d.name}: eval {i} has no assertions")
        except Exception as e:
            errors.append(f"{d.name}: invalid evals JSON: {e}")

# Verify README-listed skill names exist when formatted as code and known in catalog sections.
expected={
'evidence-first','assumption-audit','completion-audit','human-gates','dry-run','checkpoint',
'know-enough','find-precedent','ask-the-data','reconcile','what-changed','find-the-exceptions',
'automate-this','using-overpowered','skillify'}
actual={d.name for d in skill_dirs}
if expected != actual:
    errors.append(f"Skill set mismatch. missing={sorted(expected-actual)}, extra={sorted(actual-expected)}")

print(f"Validated {len(skill_dirs)} skills")
if warnings:
    print("Warnings:")
    for x in warnings: print(" -",x)
if errors:
    print("Errors:")
    for x in errors: print(" -",x)
    sys.exit(1)
print("PASS: suite structure, frontmatter, references, and eval files are internally consistent")
