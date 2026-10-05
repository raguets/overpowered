# Spécification d'évolution minimale d'Overpowered — recherche adaptative de `know-enough`

**Statut :** spécification d'implémentation MVP, avec évolutions futures explicitement non demandées  
**Destinataires :** Claude Code / OpenAI Codex  
**Date :** 3 octobre 2026  
**Dépôt cible :** `raguets/overpowered` — travailler sur le dépôt local et sa version effectivement présente, sans supposer que la structure publiée est identique.  
**Principe directeur :** enrichir la *politique* de gestion de la connaissance sans implémenter de moteur de connaissance ni imposer de technologie ou de harness.

---

## 1. Objectif et limites impératives

Faire évoluer le skill existant `know-enough` pour qu'il choisisse **la stratégie d'acquisition des connaissances la plus pertinente**, fasse exploiter les capacités déjà disponibles par le harness et vérifie si les connaissances obtenues sont suffisantes pour la tâche.

Le MVP doit rester **principalement documentaire** : mises à jour ciblées de `SKILL.md`, d'une référence de procédure et des évaluations existantes. Il ne nécessite **aucune nouvelle extension, API, bibliothèque, serveur MCP, base de données ou modèle de classification**.

### Principes non négociables

1. **Agnosticisme du harness.** `know-enough` ne cite et n'impose aucun harness, outil, extension, endpoint, fournisseur ou backend technique dans sa politique normative. Il demande une *capacité fonctionnelle* et laisse le harness identifier un skill, outil ou service disponible pour l'exécuter.
2. **Réutilisation avant création.** Ne pas dupliquer les mécanismes déjà assurés par `know-enough`, `using-overpowered`, `ask-the-data`, les autres skills disponibles ou le harness. En particulier, ne pas reconstruire les dispositifs existants de vérification des preuves ou de registre de sources.
3. **Pas de dépendance imposée.** La recherche structurée, textuelle, sémantique/hybride, relationnelle et la classification sont des **capacités optionnelles**, pas des technologies à installer systématiquement.
4. **Recherche proportionnée.** La méthode la plus simple qui peut répondre avec les preuves requises est privilégiée. Une recherche composite n'est déclenchée que si la question et les résultats le justifient.
5. **Preuves et autorisations.** Utiliser uniquement des sources effectivement accessibles et citer les éléments consultés. Une classification ou une jointure exécutée ne garantit pas la vérité des données ni des conclusions.
6. **Compatibilité ascendante.** Préserver les promesses, le vocabulaire et les contrats existants d'Overpowered, notamment `know-enough` et `using-overpowered`. Ajouter plutôt que réécrire.

### Hors périmètre du MVP — NE PAS implémenter

- Nouveau moteur RAG, moteur d'ingestion, stockage SQL/vectoriel, index, reranker ou graphe.
- Nouvelle extension pour un harness, serveur MCP, daemon ou système de découverte automatique des outils.
- Implémentation de `ask-rag-engine` ou de `classification-engine`.
- Nouveau registre de connaissances, nouveau schéma obligatoire ou migration du registre existant.
- Routeur appris, entraînement, seuils probabilistes universels, instrumentation complète ou tableau de bord.
- Modification des skills techniques externes de l'utilisateur, déploiement d'un modèle ou modification de l'architecture d'entreprise.
- Refactorisation générale d'Overpowered ou publication de nouvelle version npm : livrer une modification du dépôt prête à être évaluée, pas publier.

---

## 2. Audit très court à faire AVANT tout changement

Lire dans le dépôt local, **s'ils existent** :

- `skills/know-enough/SKILL.md`, ses références, exemples et `evals/evals.json` ;
- `skills/using-overpowered/SKILL.md` et ses éventuelles règles de découverte/délégation ;
- les passages pertinents de `README.md` et des autres documents qui décrivent la recherche et le registre de connaissances ;
- `scripts/validate_suite.py` et les conventions des évaluations existantes.

Repérer les procédures déjà couvertes : identification des lacunes, hiérarchie/autorité des sources, fraîcheur, arrêt de recherche, découverte des capacités et délégation. **Ne pas créer de doublons.** Adapter les noms de fichiers et la quantité de modifications à l'état réel du dépôt. En cas de divergence avec les chemins illustratifs ci-dessous, conserver les conventions existantes et l'expliquer brièvement dans le compte rendu.

---

## 3. Travail à réaliser maintenant — MVP (obligatoire)

### M1 — Compléter `know-enough` par une procédure adaptative courte

Ajouter dans `skills/know-enough/SKILL.md` une référence et quelques règles opérationnelles vers `references/adaptive-retrieval.md` (ou intégrer le texte à une référence appropriée déjà présente, si cela évite un doublon). Conserver le SKILL principal court, conformément à la logique de *progressive disclosure* du projet.

La procédure doit décrire ce cycle :

1. **Besoin.** Déterminer précisément quelle information manquante pourrait changer la réponse ou la prochaine décision. Si le contexte et les preuves existantes suffisent, **ne pas rechercher**.
2. **Sources et capacités.** Identifier les sources pertinentes, leur autorité/fraîcheur, les droits d'accès et les capacités fonctionnelles que le harness sait réellement mobiliser. Ne pas inventer une capacité simplement parce que le plan serait meilleur avec elle.
3. **Plan minimal.** Choisir une ou plusieurs capacités abstraites parmi celles du § 4 ; préciser brièvement le résultat attendu de chaque étape. Utiliser le chemin le plus court et le moins coûteux compatible avec l'enjeu.
4. **Exécution déléguée.** Le harness découvre les skills/outils existants correspondant aux capacités demandées et les utilise. Il conserve les identifiants, extraits et références permettant de rattacher les résultats à leurs sources.
5. **Vérification.** Évaluer la pertinence, l'autorité, la fraîcheur et la couverture des résultats ; distinguer absence de résultat, source inaccessible, preuve contradictoire et preuve insuffisante. Ne pas transformer une proximité sémantique en certitude factuelle.
6. **Décision d'arrêt.** Répondre lorsque les connaissances sont **nécessaires et suffisantes au regard de la tâche et du risque** ; sinon approfondir avec une étape ciblée. Si les moyens ou les preuves sont insuffisants, déclarer la limite au lieu de rechercher indéfiniment ou d'inventer.

Préférer une classification implicite par règles ou par raisonnement du LLM déjà actif pour les cas simples. La classification spécialisée n'est **jamais** requise.

### M2 — Documenter les stratégies sans prescrire leurs implémentations

Décrire les **capacités abstraites** suivantes (ne pas les créer sous forme d'API exécutable) :

| Capacité | Quand la privilégier | Point d'attention |
|---|---|---|
| `direct_read` | Source identifiée, fichier ciblé, petit ensemble de notes | Ne pas parcourir aveuglément de grands corpus |
| `structured_query` | Valeurs exactes, filtres combinés, agrégations, relations déjà structurées | Vérifier le schéma, les unités et les identifiants |
| `lexical_search` | Références, codes, acronymes, termes métier exacts | Tenir compte des variantes d'écriture |
| `semantic_search` / `hybrid_search` | Besoin conceptuel ou vocabulaire variable ; hybride si exact et sémantique sont tous deux utiles | Examiner les passages originaux et les scores sans seuil universel |
| `relationship_lookup` | Suivre des relations établies entre entités, sources ou données | Utiliser des identifiants fiables et des relations attestées |
| `document_preparation` | Source existante mais inexploitable sous sa forme actuelle | Déléguer à la capacité d'ingestion disponible ; ne jamais ingérer automatiquement sans autorisation |
| `classification` | Choix sémantique ambigu dont la réponse change substantiellement le plan | Facultatif, repli sur le raisonnement du LLM du harness |

**Stratégie composite :** enchaîner ou combiner plusieurs capacités *si nécessaire*, par exemple filtrage structuré puis recherche documentaire puis rapprochement par identifiants. **Ne pas imposer l'ordre « SQL puis vecteur »** : un questionnement exploratoire peut légitimement commencer par du texte ou du sémantique. Ne pas faire de recherche vectorielle si une requête exacte suffit.

Définir un **mini-contrat de plan conceptuel**, lisible par un agent, sans schéma machine obligatoire : `objectif de connaissance → capacité(s) souhaitée(s) → sources accessibles → preuves attendues → critère d'arrêt`. Il peut être exprimé en quelques lignes de langage naturel. Ne pas créer d'interpréteur, de YAML obligatoire, de JSON Schema ni de nouvel outil pour cela.

**Découverte et délégation :** `know-enough` décide **quoi acquérir et selon quelle stratégie**, pas **quel skill nommé appeler**. La sélection des skills disponibles relève du harness et, lorsque présent, de `using-overpowered` ; `know-enough` ne doit pas supposer qu'un skill donné est installé. S'il n'existe aucune capacité adéquate, utiliser une alternative légitime ou expliciter la limitation ; ne pas déclencher par défaut la création d'un nouvel outil.

### M3 — Éliminer les références au backend RAG particulier

Vérifier les références au backend spécifique nommé dans l'existant (`pi-rag`) **dans le dépôt Overpowered** : documentation générale, références de `know-enough`, exemples et assertions de tests. Remplacer les formulations prescriptives par des descriptions génériques de capacités de recherche et de leur délégation.

- Si un document d'intégration spécifique existe, le retirer ou le transformer **sans réécriture lourde** en note générique de délégation vers une capacité de retrieval.
- Ne pas remplacer ce backend par une référence à un autre outil particulier.
- Conserver la documentation du runtime Pi existant lorsqu'elle traite de l'exécution générale d'Overpowered et n'est pas relative à ce backend de recherche : **l'indépendance exigée concerne la politique de connaissance, pas l'interdiction de tout adaptateur Pi dans le dépôt**.
- Mettre à jour uniquement les passages devenus faux, périmés ou contradictoires du README.

**Critère vérifiable :** aucune référence à `pi-rag` ne subsiste dans la version livrée du dépôt Overpowered, hormis un éventuel historique figé que les conventions du dépôt imposent de conserver (signaler explicitement toute exception).

### M4 — Ajuster `using-overpowered` seulement si indispensable

Vérifier qu'il sait déjà : découvrir les skills/capacités existants, sélectionner le plus petit ensemble utile et déléguer l'exécution. **S'il sait déjà le faire, ne pas le modifier.** Sinon, ajouter au plus une règle générique indiquant qu'un plan fonctionnel exprimé par `know-enough` doit être associé aux moyens disponibles, sans noms de fournisseurs ou d'outils.

Respecter les responsabilités déjà établies de `ask-the-data` et des autres skills Overpowered. Éviter d'ajouter un nouveau routeur de skills.

### M5 — Adapter les évaluations et la documentation minimale

Mettre à jour les évaluations existantes de `know-enough` **selon leur schéma actuel** plutôt que créer un second système de tests. Ajouter, ou adapter si déjà couverts, les scénarios ci-dessous :

| Cas | Attendu observable |
|---|---|
| Preuves déjà suffisantes | Pas de recherche inutile ; décision d'arrêt justifiée |
| Référence exacte dans une source accessible | Lecture/recherche ciblée plutôt qu'appel sémantique systématique |
| Question avec critères numériques ou catégoriels | Préférence pour une capacité structurée réellement disponible |
| Question exploratoire documentaire | Recherche textuelle, sémantique ou hybride selon les capacités et les sources disponibles |
| Question composite | Enchaînement ciblé des capacités et rapprochement sur éléments vérifiables |
| Classification spécialisée absente | Fonctionnement complet par règles/LLM, sans échec ni dépendance cachée |
| Capacité technique absente ou accès refusé | Limitation annoncée ; aucune capacité ni donnée inventée |
| Plusieurs résultats contradictoires | Conflit explicité ; approfondissement proportionné ou incertitude déclarée |

Au moins un scénario doit montrer que le même principe fonctionne avec des **noms d'outils fictifs différents**, sans modifier `know-enough` ; les assertions doivent porter sur la **stratégie et les preuves**, non sur l'appel d'un produit ou outil nommé.

N'ajouter au README qu'une brève présentation du comportement adaptatif et de son agnosticisme si la documentation actuelle ne l'explique pas suffisamment. Ajouter une entrée au changelog **uniquement si le projet utilise déjà cette pratique**.

---

## 4. Frontière d'architecture à préserver

`know-enough` est une **politique de décision**, et les moyens d'exécution sont fournis par l'environnement :

```text
Demande de l'utilisateur
       |
       v
know-enough
  - lacunes utiles ?
  - sources autorisées ?
  - stratégie minimale ?
  - connaissances suffisantes ?
       |
       v
Harness / orchestration disponible
  - découverte des compétences existantes
  - association stratégie -> capacités disponibles
       |
       v
Skills / outils / services techniques accessibles
  - lecture / structuré / retrieval / relations / préparation
  - classification FACULTATIVE
       |
       v
Preuves avec provenance -> vérification -> arrêt ou approfondissement
```

Les exemples d'environnement ci-dessous sont **informatifs uniquement** et **ne doivent pas apparaître comme des dépendances dans les instructions normatives** de `know-enough` :

- Environnement actuel de l'utilisateur : un skill `structured-data-duckdb` peut fournir la capacité structurée ; un skill `document-processing` peut préparer PDF, documents bureautiques ou autres sources ; un futur `ask-rag-engine` pourra interroger un endpoint externe déjà doté d'une recherche hybride et d'un reranker.
- Un autre harness pourra réaliser exactement les mêmes stratégies avec des outils entièrement différents.

Le skill générique n'a pas à connaître ces correspondances et **ne doit pas importer de fichier de configuration propre à cet environnement**.

---

## 5. Conception ultérieure — explicitement NON demandée dans ce MVP

Cette section fixe des interfaces et des principes pour éviter une impasse architecturale. **Ne créer ni fichiers, ni scripts, ni dépendances, ni tests d'intégration correspondants maintenant**, sauf si des composants équivalents existent déjà et nécessitent une simple correction de formulation.

### F1 — `ask-rag-engine` (skill technique indépendant, plus tard)

Un petit skill technique local pourra interroger par HTTP le moteur RAG déjà déployé. Il découvrira ou recevra sa configuration dans l'environnement d'installation et exploitera les capacités réellement exposées par l'endpoint (notamment recherche hybride et reranking s'ils sont disponibles). Il restituera passages, références, identifiants et informations de recherche utiles. **Ne pas supposer le format de cette API dans Overpowered et ne pas réimplémenter le reranker.**

Cette implémentation constitue **une réponse possible** à la capacité fonctionnelle de retrieval ; `know-enough` ne la nommera ni ne la rendra obligatoire.

### F2 — `classification-engine` (skill technique indépendant, plus tard)

Lorsqu'il sera réalisé, `classification-engine` fournira une capacité **générique de jugement/classification structurés**. Il ne sera pas lié à Jev, Clef, un fournisseur ou un harness particulier. Il s'appuiera, dans la mesure où le service déployé l'expose, sur **l'interface HTTP standard SystemOne** :

- appel conceptuel : `POST /v1/systemone` sur une **URL de base configurable** ;
- requête : `model`, `state`, `questions` (les questions peuvent notamment être de type `choice`, `score` ou `noul`) ;
- réponse : `answers` indexées par identifiant de question, avec valeurs/distributions adaptées au type ;
- paramètres de déploiement et secrets gérés hors du dépôt ;
- modèles et serveurs interchangeables, sans changer le contrat métier du skill ;
- validation de la compatibilité **réelle** du serveur choisi : disposer des poids d'un modèle ne signifie pas disposer automatiquement d'un serveur HTTP SystemOne.

Exemple **illustratif de format**, non exigé du MVP :

```json
{
  "model": "<identifiant-configure>",
  "state": {"request": "Identifier les moyens d'essais adaptés à un besoin exprimé"},
  "questions": {
    "has_structured_filters": {
      "type": "noul",
      "instructions": "La demande contient-elle des filtres métier précis et exploitables ?"
    },
    "needs_semantic_retrieval": {
      "type": "noul",
      "instructions": "Une recherche conceptuelle est-elle utile pour répondre ?"
    }
  }
}
```

Les deux questions sont **indépendantes**, car les approches structurée et sémantique peuvent être combinées. Les seuils de décision éventuels devront être calibrés sur des cas réels, non codés en dur dans `know-enough`. Une probabilité de classification **n'est pas une preuve** que les sources recherchées suffisent.

**Précaution de sécurité :** ne transmettre au service de classification que le contexte utile et autorisé ; pouvoir désactiver cette capacité lorsqu'un déploiement local ou approuvé n'est pas disponible. En cas d'absence, d'erreur ou de résultat ambigu, le LLM du harness conserve la responsabilité de raisonner sur la stratégie de repli.

### F3 — Enrichissement du registre de connaissances existant (plus tard)

Le dépôt décrit déjà un registre de sources : **le conserver et ne pas le reconstruire dans le MVP**. Une évolution future pourra y ajouter, uniquement si nécessaire, des indications **fonctionnelles** telles que les modes de recherche possibles, la couverture, l'autorité, la fraîcheur, les relations entre sources et les limitations. Les correspondances entre ces modes et des outils particuliers resteront dans les environnements d'exécution, hors du cœur d'Overpowered.

Aucun nouveau format, migration, chargeur, moteur de découverte ou maintien automatique du registre n'est demandé maintenant. Le registre n'accorde **jamais** à lui seul des droits d'accès.

### F4 — Optimisations et industrialisation (plus tard)

Évaluer seulement après un premier retour d'expérience : classificateur de routage spécialisé, mesures précision/coût/latence, vérification de citations, indexation adaptative, graphes ciblés, mapping explicite capacités/skills et automatisation d'ingestion. Ces évolutions doivent répondre à une lacune mesurée.

---

## 6. Conditions d'acceptation / définition du terminé

Le travail demandé est terminé lorsque :

1. `know-enough` conserve sa mission existante et dispose d'une procédure explicite de sélection de recherches **adaptatives et proportionnées** avec règles d'arrêt.
2. Les procédures du skill expriment **des capacités abstraites uniquement** ; elles ne dépendent ni d'un harness, ni d'un outil SQL particulier, ni d'un endpoint RAG particulier, ni d'un classificateur spécialisé.
3. L'absence d'une capacité de classification spécialisée est un **cas normal**, pas une erreur ; aucune intégration SystemOne ni aucun nouveau skill technique n'a été codé.
4. Aucune mention du backend RAG spécifique à éliminer (`pi-rag`) ne reste dans la documentation vivante du dépôt, sauf exception historique expliquée ; aucun backend de remplacement n'est imposé.
5. Le fonctionnement et les responsabilités actuels de `using-overpowered`, `ask-the-data`, du runtime facultatif et des autres skills ne sont pas dégradés. Aucun changement non nécessaire n'est introduit.
6. Les évaluations adaptées couvrent les choix directs, structurés, documentaires, composites, l'absence de classificateur, les limitations et les contradictions.
7. Le validateur du dépôt (notamment `python scripts/validate_suite.py`, **s'il existe toujours sous ce chemin**) passe ; si des tests comportementaux sont effectivement exécutés, indiquer clairement lesquels et leurs résultats. Ne pas présenter de simples scénarios écrits comme des tests exécutés.
8. Le rapport final de l'agent liste les fichiers réellement modifiés, résume les décisions de conception, donne les commandes de validation et **sépare explicitement le réalisé des pistes reportées**.

### Règle de sobriété pour l'agent de codage

**Ne développer que M1 à M5.** Avant de créer un nouveau fichier ou de modifier un composant, vérifier qu'une structure équivalente n'existe pas déjà. Privilégier le plus petit diff qui satisfait les critères d'acceptation. Ne pas profiter de cette demande pour implémenter F1 à F4.

---

## 7. Références techniques externes (information uniquement)

Ces ressources servent à comprendre les contrats ou principes, **pas à introduire des dépendances dans le MVP** :

- Dépôt public Overpowered : https://github.com/raguets/overpowered
- Format Agent Skills : https://agentskills.io/specification
- API SystemOne, contrat `POST /v1/systemone` : https://docs.system-one.dev/en/docs/api
- Primitives SystemOne (`choice`, `score`, `noul`) : https://docs.system-one.dev/en/docs/primitives
- Modèle open-weight Cloudflare Clef et exemples de compatibilité SystemOne : https://huggingface.co/Cloudflare/clef

**Important :** l'agent de codage doit considérer le code et les fichiers **présents dans le dépôt local** comme source de vérité pour les conventions internes d'Overpowered ; les liens externes ne constituent pas une invitation à remodeler le projet.
