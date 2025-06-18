# Dextera Diaboli - Game Mechanics Documentation

## Overview
Dextera Diaboli is a strategic card game where players battle with unique cards from three different decks: Mercador (Merchant), Necromante (Necromancer), and Mago (Mage).

## Core Game Mechanics

### 1. Deck System
- **Three Unique Decks**: Each deck contains exactly 20 unique cards
- **Mercador (Red)**: Aggressive cards with high attack values
- **Necromante (Green)**: Dark magic cards with balanced stats
- **Mago (Blue)**: Mystical cards with strategic abilities
- **No Duplicates**: Each card in a deck is unique, eliminating card repetition

### 2. Resource System
- **Essence**: Primary resource for playing cards
- **Starting Essence**: 1 essence
- **Maximum Essence**: Increases by 1 each turn (max 10)
- **Cost**: Each card has an essence cost to play

### 3. Card Properties
- **Attack**: Damage dealt in combat
- **Life**: Maximum health points
- **Current Life**: Current health (can be reduced by damage)
- **Cost**: Essence required to play the card
- **Front Image**: Card artwork
- **Back Image**: Deck-specific back design

### 4. Turn Structure
Each turn consists of three phases:

#### Phase 1: Play Phase
- Draw 1 card from deck
- Play cards from hand to arena (up to 5 cards)
- Cards can be placed in specific slots (0-4)
- Must have sufficient essence to play cards

#### Phase 2: Combat Phase
**Sub-phase 2a: Declare Attackers**
- Select cards to attack
- Cards can attack enemy cards in same slot or go face
- Attacking cards are highlighted with yellow ring

**Sub-phase 2b: Declare Blockers**
- Defending player can assign blockers to attacking cards
- Click on enemy card to block with available player card
- Click on player card to assign as blocker for unblocked attacker
- Blocked cards are highlighted with blue ring

#### Phase 3: End Phase
- Increase maximum essence by 1
- End turn, opponent's turn begins

### 5. Combat System

#### Direct Combat (Same Slot)
- Cards in same slot automatically fight each other
- Both cards deal damage equal to their attack
- Cards with 0 or less life are destroyed
- Surviving cards remain with reduced life

#### Blocking Combat
- Attacking card fights assigned blocker instead of same-slot defender
- Blocker and attacker deal damage to each other
- If no blocker assigned, attack goes to same-slot defender or face

#### Face Damage
- If no defending card in slot and no blocker assigned
- Attack damage goes directly to opponent's life total

### 6. Card Placement
- **Slot System**: 5 slots (0-4) for each player
- **Drag & Drop**: Cards can be dragged to specific slots
- **Slot Selection**: Visual feedback shows valid drop zones
- **Slot Occupancy**: Each slot can hold one card

### 7. Life System
- **Starting Life**: 20 life points for each player
- **Damage**: Life is reduced by attack damage
- **Game Over**: Player with 0 or less life loses

### 8. AI Behavior

#### Card Playing Strategy
- Evaluates cards by (attack + life) / cost ratio
- Prioritizes high-value cards within essence budget
- Considers board state and life totals

#### Combat Strategy
- **Low Life Opponent**: Attacks with all cards to finish game
- **Favorable Trades**: Attacks when can kill opponent card and survive
- **Card Advantage**: Considers number of cards on board
- **Strategic Blocking**: 
  - Prefers blocking if can kill attacker
  - Prefers blocking if will survive attack
  - Avoids unfavorable trades
  - Considers life total advantage

#### Blocking Decisions
- **Scoring System**: Evaluates each potential block
- **Kill Bonus**: +100 points for killing attacker
- **Survival Bonus**: +50 points for surviving attack
- **Value Consideration**: +2 points per attacker attack value
- **Resource Efficiency**: +25 points for using weaker blockers
- **Life Total**: Considers overall game state

### 9. Visual Feedback
- **Attacking Cards**: Yellow ring highlight
- **Blocking Cards**: Blue ring highlight
- **Slot Highlighting**: Green for valid drop, red for invalid
- **Life Display**: Red when low (≤5), green when healthy
- **Essence Display**: Visual counter with animations

### 10. Audio System
- **Card Sounds**: Flip, select, and play effects
- **Background Music**: Thematic audio during gameplay
- **Volume Control**: Adjustable music and effects volume

## Technical Implementation

### State Management
- **Zustand Stores**: Separate stores for different game aspects
- **Battle Store**: Manages combat state and phases
- **Arena Store**: Manages card positions and arena state
- **Pile Store**: Manages deck, hand, and card drawing
- **Essence Store**: Manages resource system
- **Life Store**: Manages player life totals
- **Turn Store**: Manages turn phases and flow

### Drag & Drop System
- **DND Kit**: Modern drag and drop implementation
- **Slot Validation**: Checks essence, turn state, and arena capacity
- **Visual Feedback**: Real-time drop zone highlighting

### AI Implementation
- **Async Decision Making**: Simulates human thinking time
- **Strategic Evaluation**: Multi-factor decision making
- **State Awareness**: Considers all game aspects for decisions

## Game Balance

### Card Distribution
- **Mercador**: High attack, moderate life, moderate cost
- **Necromante**: Balanced stats, some high-cost powerful cards
- **Mago**: Varied stats, strategic options

### Resource Curve
- **Early Game**: Limited essence, basic cards
- **Mid Game**: Increasing essence, more options
- **Late Game**: High essence, powerful combinations

### Combat Balance
- **Trading**: Encourages strategic card exchanges
- **Blocking**: Adds tactical depth to combat
- **Life Management**: Critical resource to protect

This documentation provides a comprehensive overview of all game mechanics and should be used as a reference for AI development, game balance, and future feature implementation. 