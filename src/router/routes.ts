import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/satic/projects-list',
  },
  {
    // user view
    path: '/satic',
    component: () => import('layouts/HeaderLayout.vue'), // header & router-view
    redirect: '/satic/your-work',
    children: [
      {
        path: 'your-work',
        component: () => import('pages/YourWork.vue'),
        // component: () => import('pages/project_view/SpecPage.vue'),
      },
      {
        name: 'ProjectsList',
        path: 'projects-list',
        component: () => import('src/pages/project_view/ProjectListPage.vue'),
      },
      {
        path: 'projects',
        redirect: '/satic/projects-list',
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
    name: "signin",
    path: '/satic/signin',
    component: () => import('pages/signIn.vue'),
  },
  {
    // admin view
    path: '/satic/admin/dashboard',
    component: () => import('layouts/AdminLayout.vue'),
  },
  {
    // for test
    path: '/satic/test/tiptap',
    component: () => import('pages/test/TipTap.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    name: 'NotFound',
    path: '/:catchAll(.*)*',
    component: () => import('pages/errors/NotFound.vue'),
  },
];

export default routes;
