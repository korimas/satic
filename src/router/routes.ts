import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/satic/your-work',
  },
  {
    // user view
    path: '/satic',
    component: () => import('layouts/HeaderLayout.vue'), // header & router-view
    redirect: '/satic/your-work',
    children: [
      {
        path: 'your-work',
        // component: () => import('pages/YourWork.vue'),
        component: () => import('pages/SpecPage.vue'),
      },
      {
        path: 'projects-list',
        component: () => import('pages/ProjectsListPage.vue'),
      },
      {
        path: 'projects',
        redirect: '/satic/your-work',
        component: () => import('layouts/CommSideLayout.vue'),
        children: [
          {
            path: ':projectId/issues',
            component: () => import('pages/IssuesListPage.vue'),
          },
          {
            path: ':projectId/specs/:specId',
            component: () => import('pages/SpecPage.vue'),
          },
          {
            path: ':projectId/releases',
            component: () => import('pages/ReleasesListPage.vue'),
          },
          {
            path: ':projectId/reviews',
            component: () => import('pages/ReviewsListPage.vue'),
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
