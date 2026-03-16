let quests = [
  {
    id: 0,
    map: "Church",
    repeatable: false,
    name: "Squish Some Slimes I",
    texts: {
      startText:
        "Hey there, Word around here is you don't like slime!  Well, guess what bub?  I do like slime!  Maybe we can team up, you like to kill slime, I like to collect slime, what do ya say?",
      progressText:
        "Hard work, eh?  Keep at it, and I'll make it worth your while with some refereshing potions and some gold!",
      completeText: "Wow, that's a lot of slime, thanks!",
    },
    triggers: {
      talk: [{ id: 1, count: 1 }],
    },
    requirements: [
      {
        collect: [
          { id: 2, count: 3 },
          { id: 3, count: 3 },
        ],
      },
      {
        return: [{ id: 1, count: 1 }],
      },
    ],
    rewards: {
      gold: 4,
      items: [
        { id: 2, count: -3 },
        { id: 3, count: -3 },
        { id: 4, count: 3 },
        { id: 5, count: 1 },
      ],
      exp: 35,
    },
  },
  {
    id: 1,
    map: "Church",
    repeatable: false,
    name: "Squish Some Slimes II",
    texts: {
      startText:
        "Hey there, Word around here is you don't like slime!  Well, guess what bub?  I do like slime!  Maybe we can team up, you like to kill slime, I like to collect slime, what do ya say?",
      progressText:
        "Hard work, eh?  Keep at it, and I'll make it worth your while!",
      completeText: "Wow, that's a lot of slime, thanks!",
    },
    triggers: {
      talk: [{ id: 1, count: 1 }],
    },
    requirements: [
      {
        collect: [
          { id: 6, count: 3 },
          { id: 7, count: 3 },
        ],
      },
      {
        return: [{ id: 1, count: 1 }],
      },
    ],
    rewards: {
      items: [
        { id: 6, count: -3 },
        { id: 7, count: -3 },
        { id: 4, count: 3 },
        { id: 5, count: 1 },
      ],
      exp: 44,
    },
  },
  {
    id: 2,
    map: "Church",
    repeatable: true,
    name: "Introduction to Alchemy",
    texts: {
      startText:
        "Greetings!  Do you have some time to help with my work? there are some flowers just outside here, go get some of the herbs off them, and you can keep the leftover potions I make.",
      progressText:
        "Those flowers, just down there, the hornets seem to like them",
      completeText:
        "Perfect... And done! here's the leftovers, come back again soon!",
    },
    triggers: {
      talk: [{ id: 0, count: 1 }],
    },
    requirements: [
      {
        collect: [
          { id: 0, count: 5 },
          { id: 1, count: 4 },
        ],
      },
      {
        return: [{ id: 0, count: 1 }],
      },
    ],
    rewards: {
      items: [
        { id: 0, count: -5 },
        { id: 1, count: -4 },
        { id: 4, count: 3 },
      ],
      exp: 28,
    },
  },
  {
    id: 3,
    map: "Church",
    repeatable: false,
    name: "Clear The Grand Hall",
    triggers: {
      kill: [{ id: 10, count: 1 }],
    },
    requirements: [
      {
        collect: [
          { id: 9, count: 10 },
          { id: 10, count: 4 },
        ],
      },
    ],
    rewards: {
      gold: 100,
      items: [
        { id: 9, count: -10 },
        { id: 10, count: -4 },
      ],
    },
  },
  {
    id: 4,
    map: "Church",
    repeatable: false,
    name: "Graveyard Cleanup I",
    texts: {
      startText:
        "What a spooky mess around here, the dead just have no respect for the living!  Help me pick up some of this junk up would you? I can give you some stuff!",
      progressText: "Lots still to collect! keep up the good work!",
      completeText:
        "Awesome work, but there's still lots to do, come see me when you have more time on your hands!",
    },
    triggers: {
      talk: [{ id: 2, count: 1 }],
    },
    requirements: [
      {
        collect: [
          { id: 14, count: 5 },
          { id: 15, count: 18 },
        ],
      },
      {
        return: [{ id: 2, count: 1 }],
      },
    ],
    rewards: {
      items: [
        { id: 14, count: -5 },
        { id: 15, count: -18 },
      ],
      exp: 120,
    },
  },
  {
    id: 5,
    map: "Church",
    repeatable: false,
    name: "Graveyard Cleanup II",
    texts: {
      startText:
        "Man, it's no use, no matter what I do, more bones and skulls are appearing, how about we try a slightly different tactic? lets kill the buggers doing the dropping!",
      progressText: "Done yet?",
      completeText:
        "Awesome work, don't think it worked, but it was worth a shot, eh?",
    },
    triggers: {
      talk: [{ id: 2, count: 1 }],
    },
    requirements: [
      {
        collect: [
          { id: 12, count: 12 },
          { id: 13, count: 14 },
        ],
      },
      {
        return: [{ id: 2, count: 1 }],
      },
    ],
    rewards: {
      items: [
        { id: 12, count: -12 },
        { id: 13, count: -14 },
      ],
      exp: 136,
    },
  },
  {
    id: 6,
    map: "Church",
    repeatable: true,
    name: "Banishment",
    texts: {
      startText:
        "Alright, I've had enough, we need to go right to the source, there must be a necromancer around here, make there no longer be a necromancer around here.",
      progressText:
        "Any luck finding him yet? must be somwhere in the graveyard.",
      completeText: "Wowzers, your training is done, good job!",
    },
    triggers: {
      talk: [{ id: 2, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 11, count: 1 }],
      },
      {
        return: [{ id: 2, count: 1 }],
      },
    ],
    rewards: {
      items: [
        { id: 11, count: -1 },
        { id: 5, count: 5 },
      ],
      exp: 210,
    },
  },
  {
    id: 7,
    map: "Church",
    repeatable: false,
    name: "Knife Training",
    texts: {
      startText:
        "How're you with throwing knives? want to be better? throw some knives at those domestic snails over there!",
      progressText: "Keep going, you're doing great",
      completeText:
        "Awesome work, here's some more knives to keep practicing with!",
    },
    triggers: {
      talk: [{ id: 4, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 18, count: 10 }],
      },
      {
        return: [{ id: 4, count: 1 }],
      },
    ],
    rewards: {
      items: [
        { id: 18, count: -10 },
        { id: 17, count: 12 },
      ],
      exp: 64,
    },
  },

  {
    id: 8,
    repeatable: false,
    name: "Research I",
    texts: {
      startText:
        "It's crazy how much interesting life lives in these caves isn't it? I'm down here doing some research, would you be willing to help? I need some snake skins collected for a theory I have...",
      progressText: "How many ya got so far?",
      completeText: "Amazing, look at the things I can make with this!",
    },
    triggers: {
      talk: [{ id: 5, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 21, count: 10 }],
      },
      {
        return: [{ id: 5, count: 1 }],
      },
    ],
    rewards: {
      gold: 80,
      items: [{ id: 21, count: -10 }],
      exp: 130,
    },
  },
  {
    id: 9,
    repeatable: false,
    name: "Research II",
    texts: {
      startText:
        "You were so helpful with those scales, any chance you could go kill some of those mites? for... research?",
      progressText: "They just keep coming, eh?",
      completeText: "Just as I thought, they are coming from somewhere!",
    },
    triggers: {
      talk: [{ id: 5, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 22, count: 16 }],
      },
      {
        return: [{ id: 5, count: 1 }],
      },
    ],
    rewards: {
      gold: 480,
      items: [{ id: 22, count: -16 }],
      exp: 140,
    },
  },
  {
    id: 10,
    repeatable: false,
    name: "Research III",
    texts: {
      startText:
        "You've killed so many, they must have a queen somwhere, kill that for me, and I'll reward you handsomely!",
      progressText: "Be careful, it's probablly nasty!",
      completeText: "We've done good work here friend, I thank you.",
    },
    triggers: {
      talk: [{ id: 5, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 23, count: 1 }],
      },
      {
        return: [{ id: 5, count: 1 }],
      },
    ],
    rewards: {
      gold: 380,
      items: [{ id: 23, count: -1 }],
      exp: 180,
    },
  },
  {
    id: 11,
    map: "Church",
    repeatable: false,
    name: "Squish Some Slimes III",
    texts: {
      startText:
        "Wow! you're super good at this, what're you even still doing here? there's so much more to see then our little town, but anyway, if you REALLY want to help, i need more killed!!",
      progressText: "This is the last time, I promise!",
      completeText: "Wow, that's a lot of slime, thanks!",
    },
    triggers: {
      talk: [{ id: 1, count: 1 }],
    },
    requirements: [
      {
        collect: [
          { id: 6, count: 18 },
          { id: 7, count: 12 },
        ],
      },
      {
        return: [{ id: 1, count: 1 }],
      },
    ],
    rewards: {
      items: [
        { id: 6, count: -18 },
        { id: 7, count: -12 },
        { id: 4, count: 3 },
        { id: 5, count: 19 },
      ],
      exp: 68,
      equipment: [12],
    },
  },
  {
    id: 12,
    map: "ChurchCeller",
    repeatable: false,
    name: "Oh Rats!",
    texts: {
      startText:
        "I was looking to use the church cellar for storage, but there seem to be rats everywhere! You look like a quick young lad, do you think you could clear up the cellar for me?",
      progressText: "Keep going, you're doing great",
      completeText:
        "Ah wonderful, I don't have any gold for you, but take this blessing!",
    },
    triggers: {
      talk: [{ id: 6, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 32, count: 12 }],
      },
      {
        return: [{ id: 6, count: 1 }],
      },
    ],
    rewards: {
      items: [{ id: 32, count: -12 }],
      exp: 160,
    },
  },
  {
    id: 13,
    map: "ArchitonOutpost",
    repeatable: true,
    name: "Collecting Herbs",
    texts: {
      startText: "Hey there, want to help me out with collecting some stuff?",
      progressText: "Still short a few eh? well, keep it up!!",
      completeText:
        "Holy moly, ya did it, good job, here's your reward, as promised!",
    },
    triggers: {
      talk: [{ id: 22, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 41, count: 15 }],
      },
      {
        return: [{ id: 22, count: 1 }],
      },
    ],
    rewards: {
      items: [
        { id: 41, count: -15 },
        { id: 34, count: 3 },
        { id: 31, count: 1 },
      ],
      exp: 110,
      gold: 12,
    },
  },
  {
    id: 14,
    map: "Church",
    repeatable: true,
    name: "Collecting Gemstones",
    texts: {
      startText:
        "Hello again Traveller, some of the things around here have something I want, I'm looking for some gemstones, be able to find em for me?",
      progressText:
        "I can't quite remember who has them, sorry I'm not much help in that regard..",
      completeText: "Hey! that's them! thanks!",
    },
    triggers: {
      talk: [{ id: 13, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 45, count: 10 }],
      },
      {
        return: [{ id: 13, count: 1 }],
      },
    ],
    rewards: {
      items: [
        { id: 45, count: -10 },
        { id: 34, count: 3 },
        { id: 42, count: 1 },
      ],
      exp: 380,
      gold: 40,
    },
  },
  {
    id: 15,
    map: "UndergroundPassage",
    repeatable: true,
    name: "Collecting Worm Teeth",
    texts: {
      startText:
        "Hello again Traveller, Isn't this such a curious place? these worms, they are majestic! go get me their teeth.",
      progressText:
        "This is going to look really good in my showroom, very excited!",
      completeText: "Amazing! See you again soon!",
    },
    triggers: {
      talk: [{ id: 14, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 46, count: 25 }],
      },
      {
        return: [{ id: 14, count: 1 }],
      },
    ],
    rewards: {
      items: [
        { id: 46, count: -25 },
        { id: 34, count: 3 },
        { id: 43, count: 1 },
      ],
      exp: 1870,
      gold: 160,
    },
  },
  {
    id: 16,
    map: "TheDepths",
    repeatable: true,
    name: "Heating",
    texts: {
      startText:
        "Traveller! I was hoping to come across you down here, this place is wonderful! there are rocks here, that never lose heat, the golems unfortunately get their powers from them too, would be be willing to find me some?",
      progressText: "Be careful, don't burn yourself!",
      completeText:
        "Splendid! this is just what I need to heat my collection hall.",
    },
    triggers: {
      talk: [{ id: 17, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 47, count: 20 }],
      },
      {
        return: [{ id: 17, count: 1 }],
      },
    ],
    rewards: {
      items: [
        { id: 47, count: -20 },
        { id: 34, count: 3 },
        { id: 44, count: 1 },
      ],
      exp: 2740,
      gold: 285,
    },
  },
  {
    id: 17,
    map: "WesternRidges",
    repeatable: true,
    name: "More Teeth!",
    texts: {
      startText: "Traveller! Worms! Everywhere! I must have their teeth!",
      progressText: "These are WAY better then the carrion ones, trust me",
      completeText:
        "Wait, these actually look the same as the ones you got me from carrion ones, oh well..",
    },
    triggers: {
      talk: [{ id: 19, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 49, count: 20 }],
      },
      {
        return: [{ id: 19, count: 1 }],
      },
    ],
    rewards: {
      items: [
        { id: 49, count: -20 },
        { id: 34, count: 3 },
        { id: 48, count: 1 },
      ],
      exp: 6810,
      gold: 584,
    },
  },

  {
    id: 18,
    map: "ChurchCeller",
    repeatable: false,
    name: "Oh Rats! II",
    texts: {
      startText:
        "We're making quite a dent in the rat population down there, but they must be comeing from somewhere, keep it up!",
      progressText: "Keep going, you're doing great",
      completeText:
        "Ah wonderful, I don't have any gold for you, but take this blessing!",
    },
    triggers: {
      talk: [{ id: 6, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 50, count: 10 }],
      },
      {
        return: [{ id: 6, count: 1 }],
      },
    ],
    rewards: {
      items: [{ id: 50, count: -10 }],
      exp: 180,
    },
  },
  {
    id: 19,
    map: "ChurchCeller",
    repeatable: false,
    name: "Oh Rats! III",
    texts: {
      startText:
        "I think I found it, I think there must be a SUPER RAT down here, find him, remove him, do NOT give him flowers.",
      progressText: "Did ya get him?",
      completeText: "Perfect, our work here is done!",
    },
    triggers: {
      talk: [{ id: 6, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 51, count: 1 }],
      },
      {
        return: [{ id: 6, count: 1 }],
      },
    ],
    rewards: {
      items: [{ id: 51, count: -1 }],
      exp: 250,
    },
  },
  {
    id: 20,
    map: "Church",
    repeatable: false,
    name: "Clearing The Way",
    texts: {
      startText:
        "Hey there, suppose you could help me out? trying to get in here, but there's lots of baddies blocking my way, help kill em?",
      progressText: "Lots, eh?",
      completeText: "Amazing, maybe now travel will be a bit safer!!",
    },
    triggers: {
      talk: [{ id: 10, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 52, count: 10 }],
      },
      {
        return: [{ id: 10, count: 1 }],
      },
    ],
    rewards: {
      items: [{ id: 52, count: -10 }],
      exp: 350,
    },
  },
  {
    id: 21,
    map: "Church",
    repeatable: false,
    name: "Clearing The Way II",
    texts: {
      startText:
        "Know what? Now there's a bunch of eyeball looking things in my way! Eye can't handle it!",
      progressText: "Lots, eh?",
      completeText: "Thank you for clearing a path for me.",
    },
    triggers: {
      talk: [{ id: 10, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 53, count: 12 }],
      },
      {
        return: [{ id: 10, count: 1 }],
      },
    ],
    rewards: {
      items: [{ id: 53, count: -12 }],
      exp: 370,
    },
  },
  {
    id: 22,
    map: "Church",
    repeatable: false,
    name: "Clearing The Way III",
    texts: {
      startText:
        "Feel like we're almost there, there's some mean looking Acolites giving me bothers, handle em?",
      progressText: "Watch out for their energy blasts!",
      completeText: "That'll about do it for me I think!",
    },
    triggers: {
      talk: [{ id: 10, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 54, count: 14 }],
      },
      {
        return: [{ id: 10, count: 1 }],
      },
    ],
    rewards: {
      items: [{ id: 54, count: -14 }],
      exp: 500,
    },
  },
  {
    id: 23,
    map: "Church",
    repeatable: false,
    name: "Treasure Hunting!",
    texts: {
      startText:
        "Psst, Hey! there's a treasure room just up that hall way, want to help me loot it? I'll give ya some gold!",
      progressText: "Careful, some of the chests are ALIVE",
      completeText: "Maybe I can retire now!",
    },
    triggers: {
      talk: [{ id: 11, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 55, count: 20 }],
      },
      {
        return: [{ id: 11, count: 1 }],
      },
    ],
    rewards: {
      items: [{ id: 55, count: -20 }],
      exp: 425,
    },
  },
  {
    id: 24,
    map: "Church",
    repeatable: true,
    name: "Purging Fire",
    texts: {
      startText:
        "Welcome humble warrior, our great hall has been taken by hellfire, will you help me vanquish it?",
      progressText: "Thank you for your service.",
      completeText: "You have helped me greatly.",
    },
    triggers: {
      talk: [{ id: 12, count: 1 }],
    },
    requirements: [
      {
        collect: [
          { id: 56, count: 6 },
          { id: 57, count: 17 },
        ],
      },
      {
        return: [{ id: 12, count: 1 }],
      },
    ],
    rewards: {
      items: [
        { id: 56, count: -6 },
        { id: 57, count: -17 },
      ],
      exp: 325,
    },
  },

  {
    id: 25,
    map: "Church",
    repeatable: false,
    name: "Ridding the Dead",
    texts: {
      startText:
        "Hello again warrior, this land it reaks of death, will you help me purify it?",
      progressText: "Thank you for your service.",
      completeText: "One day, these caves will be safe for travel again",
    },
    triggers: {
      talk: [{ id: 15, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 58, count: 26 }],
      },
      {
        return: [{ id: 15, count: 1 }],
      },
    ],
    rewards: {
      items: [{ id: 58, count: -26 }],
      exp: 3500,
    },
  },
  {
    id: 26,
    map: "Church",
    repeatable: false,
    name: "Ridding the Dead II",
    texts: {
      startText:
        "I have found the source of the evil, it seems there is dark magic at work down here, find and destroy the totems",
      progressText: "They could be anywhere.",
      completeText: "You have helped me greatly.",
    },
    triggers: {
      talk: [{ id: 15, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 59, count: 8 }],
      },
      {
        return: [{ id: 15, count: 1 }],
      },
    ],
    rewards: {
      items: [{ id: 59, count: -8 }],
      exp: 4600,
    },
  },
  {
    id: 27,
    map: "Church",
    repeatable: true,
    name: "Mushroom Farming",
    texts: {
      startText:
        "Ya know, as dangerous as this place is, there is a TON of nice mushrooms down here to collect, some even alive, help me klll em?",
      progressText: "The living ones taste the best...",
      completeText: "My family eats today!",
    },
    triggers: {
      talk: [{ id: 16, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 60, count: 18 }],
      },
      {
        return: [{ id: 16, count: 1 }],
      },
    ],
    rewards: {
      items: [{ id: 60, count: -18 }],
      exp: 2000,
    },
  },
  {
    id: 28,
    map: "TheDepths",
    repeatable: false,
    name: "Burning Evil",
    texts: {
      startText:
        "Can you feel it down here? the pressure? the evil? we must vanquish it.",
      progressText: "It's.. hot.",
      completeText: "Another great victory!",
    },
    triggers: {
      talk: [{ id: 18, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 61, count: 15 }],
      },
      {
        return: [{ id: 18, count: 1 }],
      },
    ],
    rewards: {
      items: [{ id: 61, count: -15 }],
      exp: 7500,
    },
  },
  {
    id: 29,
    map: "TheDepths",
    repeatable: false,
    name: "Burning Evil II",
    texts: {
      startText: "Yes, I can feel we're getting closer.",
      progressText: "It's.. hot.",
      completeText: "Another great victory!",
    },
    triggers: {
      talk: [{ id: 18, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 62, count: 12 }],
      },
      {
        return: [{ id: 18, count: 1 }],
      },
    ],
    rewards: {
      items: [{ id: 62, count: -12 }],
      exp: 8200,
    },
  },
  {
    id: 30,
    map: "TheDepths",
    repeatable: false,
    name: "Burning Evil III",
    texts: {
      startText:
        "We're nearly at the core! I can see where things are coming from!",
      progressText: "It's.. hot.",
      completeText: "Another great victory!",
    },
    triggers: {
      talk: [{ id: 18, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 63, count: 1 }],
      },
      {
        return: [{ id: 18, count: 1 }],
      },
    ],
    rewards: {
      items: [{ id: 63, count: -1 }],
      exp: 9000,
    },
  },
  {
    id: 31,
    map: "WesternCliffs",
    repeatable: true,
    name: "Medical Ingrediants",
    texts: {
      startText:
        "Would you help me? I need some stuff from those plants, but man, they're vicious! I can't even get close!",
      progressText: "They bite!",
      completeText: "Aamzing, I can do wonders with this!",
    },
    triggers: {
      talk: [{ id: 21, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 64, count: 10 }],
      },
      {
        return: [{ id: 21, count: 1 }],
      },
    ],
    rewards: {
      items: [{ id: 64, count: -10 }],
      exp: 7100,
    },
  },
  {
    id: 32,
    map: "WesternCliffs",
    repeatable: false,
    name: "Hermit Troubles",
    texts: {
      startText:
        "Traveller! would you help me? I've been living off the land, but these snakes are taking over.",
      progressText: "I don't know how much longer I can stay here..",
      completeText: "Thanks, I feel a bit more safe now.",
    },
    triggers: {
      talk: [{ id: 20, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 65, count: 13 }],
      },
      {
        return: [{ id: 20, count: 1 }],
      },
    ],
    rewards: {
      items: [{ id: 65, count: -13 }],
      exp: 9800,
    },
  },
  {
    id: 33,
    map: "WesternCliffs",
    repeatable: false,
    name: "Hermit Troubles II",
    texts: {
      startText:
        "Traveller! The snakes are under control, but what of the brutes roaming these cliffs? will you help?",
      progressText: "I don't like how they look at me, with one eye..",
      completeText: "Thanks, I feel a bit more safe now",
    },
    triggers: {
      talk: [{ id: 20, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 66, count: 15 }],
      },
      {
        return: [{ id: 20, count: 1 }],
      },
    ],
    rewards: {
      items: [{ id: 66, count: -15 }],
      exp: 11000,
    },
  },
  {
    id: 34,
    map: "WesternCliffs",
    repeatable: false,
    name: "Hermit Troubles III",
    texts: {
      startText: "Did you see it?! Did you see the spirit west of here?",
      progressText: "There is dark magic at work here..",
      completeText: "I believe this land is finally safe for me.",
    },
    triggers: {
      talk: [{ id: 20, count: 1 }],
    },
    requirements: [
      {
        collect: [{ id: 67, count: 1 }],
      },
      {
        return: [{ id: 20, count: 1 }],
      },
    ],
    rewards: {
      items: [{ id: 67, count: -1 }],
      exp: 14000,
    },
  },
];