import { RouteRecordRaw } from 'vue-router';

// /satic
// /satic/your-work
// /satic/projects
// /satic/projects/<project-id>/
// /satic/projects/<project-id>/specs/<spec-id>
// /satic/projects/<project-id>/issues
// /satic/projects/<project-id>/releases

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/satic/your-work',
  },
  {
    // user view
    path: '/satic',
    component: () => import('layouts/UserLayout.vue'), // header & router-view
    redirect: '/satic/swreq',
    children: [
      {
        path: 'swreq',
        component: () => import('pages/swreq/IndexPage.vue'),
      },
      {
        path: 'projects',
        component: () => import('pages/ProjectsPage.vue'),
      },
      {
        path: 'your-work',
        component: () => import('pages/YourWork.vue'),
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
