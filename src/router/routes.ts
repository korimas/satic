import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/satic/projects/6/issues',
  },
  {
    // user view
    path: '/satic',
    component: () => import('layouts/HeaderLayout.vue'), // header & router-view
    redirect: '/satic/projects/6/issues',
    children: [
      {
        path: 'your-work',
        // component: () => import('pages/YourWork.vue'),
        component: () => import('pages/project_view/SpecPage.vue'),
      },
      {
        path: 'projects-list',
        component: () => import('pages/ProjectListPage.vue'),
      },
      {
        path: 'projects',
        redirect: '/satic/your-work',
        component: () => import('layouts/CommSideLayout.vue'),
        children: [
          {
            name: 'IssuesList',
            path: ':projectId/issues',
            component: () => import('pages/project_view/IssueListPage.vue'),
          },
          {
            name: 'SpecDetail',
            path: ':projectId/specs/:specId',
            component: () => import('pages/project_view/SpecPage.vue'),
          },
          {
            name: 'ReleasesList',
            path: ':projectId/releases',
            component: () => import('pages/project_view/ReleaseListPage.vue'),
          },
          {
            name: 'ReviewsList',
            path: ':projectId/reviews',
            component: () => import('pages/project_view/ReviewListPage.vue'),
          },
        ],
      },
    ],
  },
  {
    // admin view
    path: '/admin/dashboard',
    component: () => import('layouts/AdminLayout.vue'),
  },
  {
    // for test
    path: '/test/tiptap',
    component: () => import('pages/test/TipTap.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/errors/NotFound.vue'),
  },
];

export default routes;
