# 2025-group-11
2025 COMSM0166 group 11

## Your Game

Link to your game [PLAY HERE](https://peteinfo.github.io/COMSM0166-project-template/)

Your game lives in the [/docs](/docs) folder, and is published using Github pages to the link above.

Include a demo video of your game here (you don't have to wait until the end, you can insert a work in progress video)

## Your Group

Add a group photo here!

- Group member 1, yangyang, df24465@bristol.ac.uk, role
- Group member 2, Siyuan Chen, gd23774@bristol.ac.uk, role

## Project Report

# Game Setup Instructions


# Video Demonstration


# 2. Introduction

<div style="text-align: center;">
  <img src="Assets_For_ReadMe/oriamforreport.gif" alt="Oiram Game" width="50">
</div>

In designing our game, we set out to create a **historically immersive** tower defense experience that is both **engaging and educational**. Our vision was to craft a game that combines **strategy, progression, and cultural significance**, allowing players to explore the **rich history of Bristol** while defending the city from various threats across different time periods.

## A Unique Twist on Tower Defense

Most tower defense games focus purely on mechanics, but we wanted to **integrate historical storytelling** into the gameplay. Our game spans **multiple eras**, from the **medieval period** to the **modern day**, each with **distinct monsters, architectural styles, and defense technologies**. Players take on the role of a **"Guardian"**, protecting Bristol from **historical and futuristic threats**, including **invading armies, pirate raids, industrial uprisings, and high-tech cyber warfare**.

<div align="center">
  <div style="display: inline-block; text-align: center; margin: 10px;">
    <img src="https://github.com/UoB-COMSM0166/2025-group-11b/blob/main/images/Middle%20Ages.jpg" width="300"><br>
    <b>Figure 1</b><br>
    <i>Medieval Map</i>
  </div>

  <div style="display: inline-block; text-align: center; margin: 10px;">
    <img src="https://github.com/UoB-COMSM0166/2025-group-11b/blob/main/images/sailing.png" width="300"><br>
    <b>Figure 2</b><br>
    <i>Age of Exploration Map</i>
  </div>

  <div style="display: inline-block; text-align: center; margin: 10px;">
    <img src="https://github.com/UoB-COMSM0166/2025-group-11b/blob/main/future.png" width="300"><br>
    <b>Figure 3</b><br>
    <i>Future Map</i>
  </div>
</div>

## Strategic Depth & Progression

What makes our game unique is its **evolving technology system**—as players progress through the game, they unlock **era-specific defenses** such as:
- **Medieval archer towers**
- **18th-century naval cannons**
- **Industrial steam-powered turrets**
- **Futuristic AI-controlled drones**

Each era presents its own **challenges**, requiring players to **adapt their strategies** while leveraging **historical innovations** to fortify their defenses.

## Bringing History to Life

To enhance immersion, we carefully incorporated **real historical landmarks** from Bristol, such as:
- **Bristol Castle**
- **Clifton Suspension Bridge**
- **SS Great Britain**

These landmarks are not just **visual elements** but play a **strategic role in defense**, with some offering **unique defensive abilities**.

By combining **historical authenticity** with **engaging gameplay**, we have created a **tower defense game unlike any other**—one that **challenges players strategically** while also offering an **educational journey through time**.

# 3. Requirements

## System Needs & Implementation Considerations

Before designing our game, we considered the **core system needs**:

- **What should the system do?**
  - Provide an interactive **tower defense experience** across historical periods.
  - Allow **players to place, upgrade, and manage towers** dynamically.
  - Unlock **new defensive technologies** based on era progression.

- **User Needs**
  - Players should experience an engaging strategy game while learning about **Bristol’s historical evolution**.
  - The UI should allow **intuitive tower placement, upgrades, and resource management**.

- **Host Organization Needs**
  - If used educationally, the game should include **historical accuracy and informational elements**.
  - The system should be **easy to maintain and update** with additional content.

- **Interoperability Needs**
  - The game should be **accessible across devices** (PC, console, web).

---

## Use Case Diagram, User Stories, and Early Design Process

### Use Case Diagram
- **Actors & Use Cases**:
  - **Player (Guardian Role)**:
    - Places and upgrades towers.
    - Unlocks era-specific defenses.
    - Monitors monster waves and adapts tactics.
    - Appreciates historical landmarks and gains bonuses.

  - **Monster AI (Dynamic Threats)**:
    - Attacks in waves with different strategies.
    - Adapts based on player defenses.
    - Features unique monster types (e.g., knights, pirates, cyber threats).

  - **Game System**:
    - Generates monster waves per era.
    - Unlocks new technologies.
    - Provides real-time visual and audio feedback.

---

## User Stories

- **Gameplay Mechanics**:
  - `Add tower placement`
    - As a player, I want to place towers on a grid to defend strategically.
  - `feat: Implement tower upgrades`
    - As a player, I want to upgrade towers to counter stronger monsters.
  - `feat: Add monster variety`
    - As a player, I want diverse monster types to challenge my strategies.

- **Era Progression & Difficulty**:
  - `Introduce era-based threats`
    - As a player, I want new challenges in each era.
  - `feat: Implement rewards`
    - As a player, I want to earn in-game currency for upgrades.
  - `feat: Implement difficulty scaling`
    - As a player, I want dynamic difficulty to match my skill level.

- **Historical Elements & Landmarks**:
  - `Add landmarks`
    - As a player, I want to appreciate Bristol landmarks (e.g., Clifton Bridge, Bristol Castle) while gaining defensive bonuses.
  - `feat: Include historical learning`
    - As a player, I want to learn about **historical events and figures**.

---

## Functional & Non-Functional Requirements  

### **Functional Requirements** (What the system should do)
- The game must support **tower placement, upgrades, and defensive strategies**.
- Monsters must **adapt dynamically** to player actions.
- The system should provide **audio-visual feedback**.
- Different levels must represent **historical periods**.

### **Non-Functional Requirements** (Quality attributes)
- **Security:** Prevent unauthorized access to game data.
- **Usability:** Provide an intuitive interface for new and experienced players.
- **Performance:** Maintain **smooth framerates**.
- **Scalability:** Allow future updates for additional content.

---

## Early Design & Prototyping

- `Define early game concept`
  - Combined **historical accuracy with strategy**.
  - Structured across **multiple time periods**.
  - Integrated **historical landmarks as gameplay elements**.

- `gameplay pillars`
  - **Strategic Placement & Adaptation**:
    - Players must carefully position defenses.
  - **Era-Specific Towers & Monsters**:
    - Example: Medieval era uses **archers**, while the Industrial era introduces **steam-powered turrets**.
  - **Historical Landmarks as Gameplay Features**:
    - Real-world locations enhance **gameplay and strategy**.

- `Develop early prototype`
  - Focused on:
    - Grid-based tower placement.
    - Monster AI pathfinding.
    - UI concepts for resource management.
  - Validated **core mechanics** before full-scale development.

---
# 4. Design: System Architecture & Diagrams

## `Summarize design approach`
This document outlines the **multi-layered architecture**, **core classes**, and **behavioral diagrams** for our **historical tower defense game**, ensuring **scalability**, **maintainability**, and **optimal performance**.

---

## `Multi-layered architecture`

### System Architecture
The game is split into **three primary layers** to separate concerns and streamline development.

1. **Client Layer (Frontend)**
   - `Implement UI & Input Handling`
     - Displays **towers, monsters, and maps**.
     - Handles **mouse clicks** for placing/upgrading towers.
     - Provides **real-time feedback** with animations and sounds.
     - Implements a **grid-based system** for strategic tower placement.

2. **Game Logic Layer (Core Mechanics)**
   - `Implement tower management`
     - Handles **placing, upgrading, and selling towers**.
     - Integrates **historical tower types** with unique abilities.
   - `Develop monster AI & pathfinding`
     - Uses BFS for pathfinding.
     - Monsters **adapt** routes based on tower placements.
   - `Implement wave & progression system`
     - Spawns **monster waves** with increasing difficulty.
     - Unlocks **new eras** for additional challenges.
   - `Create resource system`
     - Players **earn currency** for defeating monsters.
     - Allows **purchasing/upgrading towers**.

---

## `Define core class structure`

### Class Diagram
Below is the **OOP-based hierarchy** capturing major classes:

- **GameManager (Singleton)**
  - Manages **levels, waves, and game state**.
  - Handles **resource updates** and **UI notifications**.
  
- **Tower (Parent Class)**
  - **Attributes**: `damage`, `range`, `attackSpeed`, `cost`, `eraType`.
  - **Methods**: `attackMonster()`, `upgradeTower()`, `sellTower()`.
  - **Subclasses**: `ArcherTower`, `CannonTower`, `TeslaCoil`, `AIDrone`.

- **Monster (Parent Class)**
  - **Attributes**: `health`, `speed`, `reward`, `armorType`.
  - **Methods**: `moveAlongPath()`, `takeDamage()`, `die()`.
  - **Subclasses**: `Knight`, `Pirate`, `IndustrialRebel`, `CyberSoldier`.
  
- **Player**
  - **Attributes**: `resources`, `livesRemaining`, `currentEra`.
  - **Methods**: `placeTower()`, `upgradeTower()`, `pauseGame()`.

- **PathfindingManager**
  - Implements **BFS**.
  - Adjusts **monster routes** dynamically based on **tower positions**.

---

## `Implement tower placement behavior`

### Sequence Diagram – Placing a Tower
```plaintext
Player → UIManager: Clicks to place tower
UIManager → GameManager: Sends placement request
GameManager → TowerManager: Validates tower position
TowerManager → GameMap: Checks grid availability
GameMap → TowerManager: Returns result (success/fail)
TowerManager → GameManager: Confirms placement
GameManager → UIManager: Updates UI (tower placed)
```
## `Implement monster behavior lifecycle`

### State Diagram – Monster Behavior
~~~~plaintext
[Monster Spawned] → [Moving]  
[Moving] → (Hit by Tower) → [Taking Damage]  
[Taking Damage] → (Health > 0) → [Continue Moving]  
[Taking Damage] → (Health = 0) → [Monster Dies]  
[Monster Dies] → [Player Gains Reward]
~~~~

## `Optimize architecture for scalability`
- **Modular design** accommodates new towers, monsters, maps.
- **Component-based** approach ensures easy maintenance.

## `Enhance performance`
- **Optimized BFS for seamless monster movement.
- **Object pooling** to reduce overhead when spawning monsters.
- **Memory management** for large assets.

## `Improve user experience`
- **Intuitive UI** for placing/upgrading towers.
- **Real-time audio/visual feedback** for attacks and upgrades.
- **Difficulty scaling** matching player skill.

## `Integrate history & strategy`

# 5. Implementation

feat: Implement game structure and core components

- Researched similar games and decided to divide the game into four main components: **map, towers, monsters, and the main interface**.
- Created four separate classes: **maps.js, tower.js, monster.js, and main.js**.
- Implemented core functionalities:
  - **Placing, purchasing, selling, and upgrading towers**.
  - **Pausing, starting, and resetting the game**.
  - **Speeding up monster movement**.
  - **Exiting and switching to the team interface**.

### Challenges

#### 1. Integrate Bristol landmarks with game map

- This was by far the hardest task: finding a way to seamlessly integrate **Bristol's landmarks** into a **tower defense-style game map**.
- We aimed to blend **Bristol’s unique elements** with the game’s mechanics while maintaining **strategic gameplay balance**.
- Implemented location-based tower placements to align with real-world landmarks.
- Designed custom textures and structures inspired by **Bristol’s architecture** to enhance immersion.


<p align="center">
  <img src="https://github.com/feixiangkong/tower-defence/blob/main/final_map.png" width="500"><br>
  <b>Figure 15</b><br>
  <i>Map integrating Bristol MVB and Chemistry Buildings</i>
</p>

#### 1.1 Splitting Game Maps  
   We explored various methods to split existing tower defense maps and integrate them into our game. Using Python in combination with OpenCV and Matplotlib, we visualized the maps. After dozens of attempts, we ultimately decided on an 8-row by 12-column grid layout.

<p align="center">
  <img src="https://github.com/feixiangkong/tower-defence/blob/main/split_maps.png"><br>
  <b>Figure 16</b><br>
  <i>Attempting to split tower defense game maps</i>
</p>

#### 1.2 Converting Images into a Cartoon Style  
At first, we attempted to embed the MVB and teaching buildings into the game images. However, we found that the styles were inconsistent. To resolve this, we explored various methods to convert images into a cartoon style. We tried multiple approaches, including using some software found on TikTok and features available on existing websites.

Ultimately, we decided to use a Photoshop plugin called Clone, which easily transforms images into a cartoon style. However, while integrating this plugin, we encountered the "Plugin is not properly signed" issue on Windows systems. To resolve this, we modified the Windows Registry Editor to successfully integrate the software.

<p align="center">
  <img src="https://github.com/feixiangkong/tower-defence/blob/main/MVB%20500%20x%20250.jpg"><br>
  <b>Figure 19</b><br>
  <i>Original image</i>
</p>
<p align="center">
  <img src="https://github.com/feixiangkong/tower-defence/blob/main/MVB%20cartoon.png"><br>
  <b>Figure 20</b><br>
  <i>Cartoonized image</i>
</p>
<p align="center">
  <img src="https://github.com/feixiangkong/tower-defence/blob/main/clone.png" width="500"><br>
  <b>Figure 21</b><br>
  <i>Photoshop Plugin</i>
</p>
<p align="center">
  <img src="https://github.com/feixiangkong/tower-defence/blob/main/register_fault.png" width="500"><br>
  <b>Figure 22</b><br>
  <i>Register_Fault</i>
</p>

#### 1.3 First Failed Attempt  
We attempted to insert the cartoonized MVB and Chemistry Building into our game map, but it was an obvious failure—the cartoonized images were 2D, while the game map was 2.5D. This initial setback was quite frustrating for us.

<p align="center">
  <img src="https://github.com/feixiangkong/tower-defence/blob/main/First_Failed_Attempt.png" width="500"><br>
  <b>Figure 23</b><br>
  <i>First_Failed_Attempt</i>
</p>

#### 1.4 Final Work  
After a long period of consideration, we ultimately decided to convert the images into 2.5D. We tried another Photoshop plugin called 2.5D Generator 2, which allowed us to add depth to the images. After that, we adjusted the brightness to make the images blend better with the game map. We all agreed that the final result was highly satisfactory.

<p align="center">
  <img src="https://github.com/feixiangkong/tower-defence/blob/main/3D-transformed%20MVB.png" width="500"><br>
  <b>Figure 24</b><br>
  <i>2.5D</i>
</p>
<p align="center">
  <img src="https://github.com/feixiangkong/tower-defence/blob/main/final_map.png" width="500"><br>
  <b>Figure 25</b><br>
  <i>final map</i>
</p>

#### 2. Frame Animation Design
1. Frame Rate Optimization
- Choosing the right frame rate is crucial to balance smoothness and performance.
- Too low FPS results in choppy animations, while too high FPS can cause performance issues.

2. Sprite Sheet Management
- Efficiently organizing sprite sheets to reduce memory usage and rendering time.
- Ensuring correct frame alignment to avoid misalignment when drawing.
- Handling different frame sizes dynamically.

3. Directional Animations
- Designing animations for multiple directions (e.g., left, right, up, down).
- Avoiding redundant frames by flipping sprites instead of drawing extra frames.

4. Animation Timing and Synchronization
- Controlling frame transitions smoothly based on speed or events.
- Synchronizing animations with game physics (e.g., running, attacking, jumping).
- Ensuring consistent playback across different devices.

5. State Transitions and Blending
- Handling smooth transitions between animations (e.g., walking to running to idle).
- Avoiding sudden jumps or unnatural movements.
- Implementing animation blending for fluid motion.
  ![image](https://github.com/user-attachments/assets/811b6111-4b64-4f6d-a2b5-9d27afa220ca)
  ![image](https://github.com/user-attachments/assets/a41a0005-edf9-4949-8b33-4c7fdc5c188d)

2. **Level Design and balance**

   We realised early on that we wanted to build the level map in an extensible way, so the `Map` class contains a function that reads a text file representing the map (Figure 17). This allowed maximal flexibility whilst developing our maps, especially as core game mechanics like jump height were being changed. We opted not to use procedural generation, as we felt control was important given the puzzle-solving nature of the game. This is because we found that many decisions, like where a button is located, can profoundly affect a player's ability to complete a particular puzzle.

<p align="center">
  <b>Figure 17</b><br>
  <i>The level designer</i><br>
    <img src="https://i.imgur.com/0kD1yRU.png" width="500" >
</p>
<p align="center">
  <b>Figure 18</b><br>
  <i>The level, as designed in Figure 17.</i><br>
    <img src="https://i.imgur.com/Suklhby.png" width="500" >
</p>
    
   This level designer was very helpful when in playtesting. For example, one user found the jump in the tutorial level too challenging to complete, but with a few keystrokes, we were able to change it and immediately gather feedback that the same user found it easier.
   
3.1 **Accessibility:** *Performance Challenges*

<p align="center">
  <b>Figure 19</b><br>
  <i>Demonstration of Accessibility Use-Case.</i><br>
  <img src="Assets_For_ReadMe/Game_Video_V5.gif">
</p>
   Accessibility was a really important aspect for us, as we have team members with personal experience of their disability locking them out of games. So, we built a way to play the game without keyboard input (Figure 18). When planning this feature, we researched that this can be achieved where users with accessibility needs could lean left and right for player movement, and make a noise for the player to jump. To program this, we used the `Machine Vision` and `Audio` libraries, where input from the webcam is taken, and if the user's head is detected on one side of the screen, the character moves that way. Audio input was taken using Processing’s sound library, and if it spikes over a certain level a jump signal is sent to the player character. We found that the main challenge of this was efficiency affecting game performance, as the first library we used was too slow, as it was doing pose detection. We switched to just detecting the head position, and the game worked. 


3.2 **Accessibility:** *Linux Issues*

The other element of the game that evolved significantly was the interface for selecting disability mode. Through user testing, we discovered that the Processing `Video` library experiences issues on Linux. Rather than have an unplayable game on Linux, we load the library when the accessibility button is clicked. Our heuristic evaluation required us to include a dynamic loading screen (visibility of system status) since the library takes several seconds to initialise.

Clicking the accessibility button on Linux causes an error message to show up (Figure 20).


<p align="center">
  <b>Figure 20</b><br>
  <i>Example of Error.</i><br>
<img src="Game/assets/Background/LinuxErr.png" width="75%">
</p>

### Introduction

- 5% ~250 words 
- Describe your game, what is based on, what makes it novel? 

### Requirements 

- Requirements for Tower Defense Game
1. Identify Stakeholders
- Players: The main users who play the game.
- Game Designers: Those who design levels and mechanics.
- Developers: Programmers implementing the game.
- QA Testers: People testing for bugs and balance.
- Artists: Designers of game assets (characters, towers, environment).
- Sound Designers: Those who create sound effects and music.
- Project Managers: Oversee development progress.
- Marketing Team: Promote the game to players.
- Investors/Publishers: Fund the project.
- Community Moderators: Manage player discussions and feedback.
2. Epics & User Stories (12 total)
- Epic 1: Gameplay Mechanics
As a player, I want to place towers on a grid so that I can strategize my defense.
As a player, I want different types of towers with unique abilities so that I can choose the best defense strategy.
As a player, I want monsters to move along a predefined path so I can predict their movement.
- Epic 2: Progression & Difficulty
As a player, I want waves of monsters to become progressively harder so that the game remains challenging.
As a player, I want to earn in-game currency for defeating monsters so I can upgrade my towers.
As a player, I want a difficulty setting so I can adjust the challenge based on my skill level.
- Epic 3: Graphics & UI
As a player, I want an intuitive UI that clearly displays my available resources and tower placements.
As an artist, I want to design visually distinct monster types so players can recognize threats easily.
As a UI designer, I want to create a pause menu where players can restart or change settings.
-- Epic 4: Sound & Feedback
As a player, I want sound effects when I place towers and when monsters are defeated so I get immediate feedback.
As a sound designer, I want background music that changes intensity as waves progress to enhance immersion.
As a player, I want visual and sound cues when a tower is upgraded so I know my upgrades are successful.
3. Breakdown of One User Story
Example: "As a player, I want to place towers on a gr

#### Stakeholders List  

- **Players**: The main users who play the game.  
- **Game Designers**: Those who design levels and mechanics.  
- **Developers**: Programmers implementing the game.  
- **QA Testers**: People testing for bugs and balance.  
- **Artists**: Designers of game assets (characters, towers, environment).  
- **Sound Designers**: Those who create sound effects and music.  
- **Project Managers**: Oversee development progress.  
- **Marketing Team**: Promote the game to players.  
- **Investors/Publishers**: Fund the project.  
- **Community Moderators**: Manage player discussions and feedback. 
  

### Design

- 15% ~750 words 
- System architecture. Class diagrams, behavioural diagrams. 

### Implementation

- 15% ~750 words

- Describe implementation of your game, in particular highlighting the three areas of challenge in developing your game. 

### Evaluation

- 15% ~750 words

- One qualitative evaluation (your choice) 

- One quantitative evaluation (of your choice) 

- Description of how code was tested. 

### Process 

- 15% ~750 words

- Teamwork. How did you work together, what tools did you use. Did you have team roles? Reflection on how you worked together. 

### Conclusion

- 10% ~500 words

- Reflect on project as a whole. Lessons learned. Reflect on challenges. Future work. 

### Contribution Statement

- Provide a table of everyone's contribution, which may be used to weight individual grades. We expect that the contribution will be split evenly across team-members in most cases. Let us know as soon as possible if there are any issues with teamwork as soon as they are apparent. 

### Additional Marks

You can delete this section in your own repo, it's just here for information. in addition to the marks above, we will be marking you on the following two points:

- **Quality** of report writing, presentation, use of figures and visual material (5%) 
  - Please write in a clear concise manner suitable for an interested layperson. Write as if this repo was publicly available.

- **Documentation** of code (5%)

  - Is your repo clearly organised? 
  - Is code well commented throughout?
