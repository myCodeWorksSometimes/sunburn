"""Name the Act 3 art delivered in newimages/ and stage it in assets/backgrounds/.

Each Act 3 area is one whole painting (art/background_prompts_act3.md). Run
process_backgrounds.py afterwards.

Usage: python tools/import_act3.py
"""
import os
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "newimages")
DST = os.path.join(ROOT, "assets", "backgrounds")
G = "Gemini_Generated_Image_"

# name -> delivered file
DIRECT = {
    "bg_a3_courtyard_dark": "mptdb6mptdb6mptd (1)",
    "bg_a3_courtyard_restored": "mptdb6mptdb6mptd (2)",
    "bg_a3_mechanisms_dark": "mptdb6mptdb6mptd",
    "bg_a3_mechanisms_restored": "mptdb6mptdb6mptd (3)",
    "bg_a3_landing_dark": "fsy31rfsy31rfsy3",
    "bg_a3_landing_restored": "fsy31rfsy31rfsy3 (1)",
}


def main():
    for name, src in DIRECT.items():
        shutil.copyfile(os.path.join(SRC, G + src + ".jpg"), os.path.join(DST, name + ".jpg"))
        print(name, "<-", src)


if __name__ == "__main__":
    main()
