# DESIGN.md — Direction Artistique WoufGuide

## 1. Personnalité visuelle
**WoufGuide** est un guide éditorial français **ludique, chaleureux et honnête** sur les races de chiens.  
L'esthétique s'inspire de la presse illustrée moderne et des carnets de terrain : papier crème chaud, portraits gouache sur médaillons pastel, typographie de caractère et hiérarchie franche.  
**Anti-patterns proscrits** : dégradés violet/bleu génériques, fond blanc clinique ou gris froid SaaS, cartes surchargées, marketing qui cache les défauts d'une race.

## 2. Palette sémantique (contraste WCAG AA+)
- **Fond principal** : Crème chaud `#FFFDF7` (`--bg-cream`)
- **Surface carte** : Blanc cassé chaud `#FFFFFF` avec bordure sable `#E8DDD0`
- **Surface douce** : Sable clair `#FBF3E4` (`--bg-sand`)
- **Encre principale** : Espresso / chocolat profond `#241B15`
- **Encre secondaire** : Brun doux `#5C4D42`
- **Accent primaire** : Terracotta vif `#D94E1F` (survol `#B83D14`, texte blanc)
- **Accent secondaire** : Moutarde / ambre `#E89B1C`
- **Avantages (Pour)** : Émeraude franc `#147A53` sur fond `#EBF8F1` (bordure `#B7E5CF`)
- **Inconvénients (Contre)** : Framboise / corail soutenu `#B83244` sur fond `#FDECEF` (bordure `#F5C2CB`) — **poids visuel strictement égal aux Avantages**.

## 3. Typographie
- **Titres (Display)** : `Fraunces` (serif chaleureuse et expressive, graisses 600–800)
- **Corps & UI** : `Plus Jakarta Sans` (géométrique douce et très lisible, graisses 400–700)

## 4. Rythme & Composants
- Rayons généreux (`rounded-2xl` / `rounded-3xl`), ombres douces teintées chaud (`rgba(36, 27, 21, 0.06)`).
- Navigation simple à 3 entrées : **Catalogue**, **Comparateur**, **Quiz**.
- Conception **mobile-first** avec cibles tactiles confortables (≥ 44px) et balises HTML sémantiques.
