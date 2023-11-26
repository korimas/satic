import {defineStore} from 'pinia';

interface DocTreeNode {
  key: string;
  label: string;
  icon: string;
  lazy: boolean;
  children?: DocTreeNode[];
}

interface DocEntry {
  type: string;
  key: string;
  summary: string;
  description: string;
  comment: string;
  openEdit: boolean;
}

export const useDocumentStore = defineStore('doc', {
  state: () => ({
    DocEntryMap: {
      'SWRS-1': {
        type: 'Requirement',
        key: 'SWRS-1',
        summary: 'Survival priority',
        description: 'During the runtime of the software, it shall ensure that the state machine for mode switching is always in an active stat unless the software crashes',
        comment: '',
        openEdit: false
      }
      , 'SWRS-2': {
        type: 'Requirement',
        key: 'SWRS-2',
        summary: 'Disable noise filtering in calibration mode',
        description: 'In calibration mode, the software shall not perform the operation of noise filtering.',
        comment: '',
        openEdit: false
      }, 'SWRS-3': {
        type: 'Requirement',
        key: 'SWRS-3',
        summary: 'collect info for INNO_LIDAR_IN_FAULT_EXCESSIVE_BLOOMING',
        description: 'when fault INNO_LIDAR_IN_FAULT_EXCESSIVE_BLOOMING occured, the software shall collect the information on the angle of the high reflection area, reference light intensity, and duration.',
        comment: '',
        openEdit: false
      }, 'SWRS-4': {
        type: 'Requirement',
        key: 'SWRS-4',
        summary: 'Configure noise filtering operations',
        description: 'The software shall support the ability to specify through configuration whether to perform the operation of noise filtering.',
        comment: '',
        openEdit: false
      }, 'SWRS-5': {
        type: 'Requirement',
        key: 'SWRS-5',
        summary: '8-neighbor filtering mode',
        description: 'When the filtering mode is set to 8-neighbor, it shall select the points in the following directions of this point to determint whether they are neighbor points: top left, top, top right, left, right, bottom left, bottom, and bottom right.',
        comment: '',
        openEdit: false
      }, 'SWRS-6': {
        type: 'Requirement',
        key: 'SWRS-6',
        summary: '2-neighbor filtering mode',
        description: 'When the filtering mode is set to 2-neighbor, it shall determine whether the left and right points of the point are adjacent points.\n',
        comment: '',
        openEdit: false
      }, 'SWRS-7': {
        type: 'Requirement',
        key: 'SWRS-7',
        summary: 'judgment of neighbor points',
        description: 'The judgment of neighbor points needs to simultaneously satisfy the following conditions:\n' +
          '1. The interpolation distance between the current point and the adjacent point is less than the threshold.\n' +
          '2. The difference in trigger period between the current point and the adjacent point is greater than 24ns.\n' +
          '3. The distance measurement of adjacent points is non-zero.',
        comment: '',
        openEdit: false
      }, 'SWRS-8': {
        type: 'Requirement',
        key: 'SWRS-8',
        summary: 'trigger period difference configurable',
        description: 'The software shall support specifying the trigger period difference between valid neighbor points and the current return point through a configuration file.\n',
        comment: '',
        openEdit: false
      }, 'SWRS-9': {
        type: 'Requirement',
        key: 'SWRS-9',
        summary: 'Forced 2-neighbor filtering mode',
        description: 'The software must enforce the use of dual adjacency filtering when the following conditions are simultaneously met: the total number of noise points filtered out in a frame is greater than the return light count multiplied by a threshold value 10000, and the software is not currently in the forced dual adjacency filtering mode.',
        comment: '',
        openEdit: false
      }, 'SWRS-10': {
        type: 'Requirement',
        key: 'SWRS-10',
        summary: 'Not noise',
        description: 'During the noise reduction process, if the following conditions are simultaneously met, the point is considered not to be noise:\n' +
          '1) The distance measurement of the return point is not zero.\n' +
          '2) The number of valid neighbor points reaches the threshold value or there is at least one high-quality adjacent point.',
        comment: '',
        openEdit: false
      }, 'SWRS-11': {
        type: 'Requirement',
        key: 'SWRS-11',
        summary: 'Configure the parameters for noise detection.',
        description: 'The software shall support specifying the threshold values for the number of neighbor points in noise judgment through a configuration file.',
        comment: '',
        openEdit: false
      }, 'SWRS-12': {
        type: 'Requirement',
        key: 'SWRS-12',
        summary: 'High-quality neighbor point identification.',
        description: 'The software shall identify high-quality neighbor points based on the following rule: within the range of distance difference for that adjacent point, there should exist a confirmed real return point.',
        comment: '',
        openEdit: false
      }, 'SWRS-13': {
        type: 'Requirement',
        key: 'SWRS-13',
        summary: 'Configure the parameters for High-quality neighbor point',
        description: 'The software shall support specifying the distance difference parameter for high-quality neighbor point determination through configuration.',
        comment: '',
        openEdit: false
      }, 'SWRS-14': {
        type: 'Requirement',
        key: 'SWRS-14',
        summary: 'Print the statistical information of noise points for each frame.',
        description: 'If the number of noise points in a frame exceeds the return light count multiplied by 20,000, the software shall print the statistical information of noise points for that frame.',
        comment: '',
        openEdit: false
      }, 'SWRS-15': {
        type: 'Requirement',
        key: 'SWRS-15',
        summary: 'Calculate and print the processing time for noise filtering.',
        description: 'The software shall calculate the processing time for noise filtering for each scan line, and print it every 50 seconds.',
        comment: '',
        openEdit: false
      }
    },
    DocTree: [
      {
        key: 'SWRS-1',
        label: 'Overview',
        icon: 'folder',
        lazy: true
      },
      {
        key: 'SWRS-2',
        label: 'Work Mode',
        icon: 'folder',
        lazy: true
      },
      {
        key: 'SWRS-3',
        label: 'Network Management',
        icon: 'folder',
        lazy: true
      },
      {
        key: 'SWRS-4',
        label: 'Point Cloud Service',
        icon: 'folder',
        lazy: true
      }
    ]
  }),

  getters: {
    AllDocument(state) {
      return state.DocEntryMap;
    }
  },

  actions: {
    UpdateDocument(value: any) {
      this.DocEntryMap = value;
    }
  }
});
