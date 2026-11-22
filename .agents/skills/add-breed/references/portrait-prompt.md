# Gabarit de portrait illustré WoufGuide

Pour maintenir une galerie homogène dans `public/images/breeds/`, utilise toujours cette trame avec le subagent `image-generator` :

```text
Generate a warm, playful, editorial flat-gouache vector-style square (1:1) portrait illustration of a <NOM DE LA RACE EN ANGLAIS> dog (<description robe, oreilles, expression>, head and shoulders, facing forward, no text or badges) centered on a soft pastel <COULEUR PASTEL> circular background (<HEX>) over a clean light cream canvas (#FFFDF7). Modern French editorial illustration style, crisp clean shapes, rich warm tones, zero text, zero watermark.
```

## Palette de cercles pastel recommandée
- Abricot doux : `#FDE8D0`
- Menthe sauge : `#DDF3E4`
- Bleu ciel : `#DCEEFB`
- Pêche rosé : `#FCE1E4`
- Jaune beurre : `#FEF0C7`
- Lavande douce : `#EAE2F8`
- Sable chaud : `#F5E6D3`

## Conversion finale en PNG 512×512 (macOS)
```bash
sips -s format png -Z 512 "<chemin_jpg_genere>" --out "public/images/breeds/<slug>.png"
```
