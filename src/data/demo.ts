import { Project } from './structs';

export const AllProjects = <Project[]>[
  {
    name: 'Falcon I',
    key: 'FI',
    icon: '/icons/random/icon2.svg',
    ID: 'a4649823-b67e-48a1-af1f-1eadce016fc8',
    desc: 'description a',
  },
  {
    name: 'Falcon G',
    key: 'FG',
    icon: '/icons/random/icon3.svg',
    ID: '2c485ec4-cc23-4245-a272-0afef4735364',
    desc: 'description aaaaa',
  },
  {
    name: 'Falcon 10K',
    key: 'F10K',
    icon: '/icons/random/icon4.svg',
    ID: 'bbee88c7-e96e-40b9-bf54-1da3798ddac0',
    desc: 'description sdfsdfasdf',
  },
  {
    name: 'Falcon II',
    key: 'FII',
    icon: '/icons/random/icon2.svg',
    ID: '1e6bfb06-ed6b-47b7-9b05-e80706b0bfdc',
    desc: 'description',
  },
  {
    name: 'Falcon 2.1',
    key: 'FC',
    icon: '/icons/random/icon3.svg',
    ID: 'cf6e69ed-78da-4dc6-ac97-095c237b8430',
    desc: 'description',
  },
  {
    name: 'Falcon II Pro',
    key: 'FIIPro',
    icon: '/icons/random/icon4.svg',
    ID: 'a0d10b35-c5ed-4142-9152-85ddc166d476',
    desc: 'description',
  },
];

export const StarredProjects = <Project[]>[
  {
    name: 'Falcon I',
    key: 'FI',
    icon: '/icons/random/icon2.svg',
    ID: 'a4649823-b67e-48a1-af1f-1eadce016fc8',
    desc: 'description a',
  },
  {
    name: 'Falcon G',
    key: 'FG',
    icon: '/icons/random/icon3.svg',
    ID: '2c485ec4-cc23-4245-a272-0afef4735364',
    desc: 'description aaaaa',
  },
  {
    name: 'Falcon 10K',
    key: 'F10K',
    icon: '/icons/random/icon4.svg',
    ID: 'bbee88c7-e96e-40b9-bf54-1da3798ddac0',
    desc: 'description sdfsdfasdf',
  },
];

export const RecentProjects = <Project[]>[
  {
    name: 'Falcon II',
    key: 'FII',
    icon: '/icons/random/icon2.svg',
    ID: '1e6bfb06-ed6b-47b7-9b05-e80706b0bfdc',
    desc: 'description 646151651',
  },
  {
    name: 'Falcon 2.1',
    key: 'FC',
    icon: '/icons/random/icon3.svg',
    ID: 'cf6e69ed-78da-4dc6-ac97-095c237b8430',
    desc: 'description',
  },
  {
    name: 'Falcon II Pro',
    key: 'FIIPro',
    icon: '/icons/random/icon4.svg',
    ID: 'a0d10b35-c5ed-4142-9152-85ddc166d476',
    desc: 'description',
  },
];

export function getProject(id: string): Project | undefined {
  const project = AllProjects.find((p) => p.ID === id);
  if (project) {
    return project;
  }
}
