lines = open("contest_tags.json", "r", encoding="utf-8").readlines()
new_lines = []
for line in lines:
    if line.endswith("\"\",\n"):
      continue
    new_lines.append(line)
open("contest_tags.json", "w", encoding="utf-8").write("".join(new_lines))