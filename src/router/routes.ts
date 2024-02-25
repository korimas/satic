import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/main/swreq',
    // component: () => import('layouts/DocLayout.vue'),
    // children: [
    //   { path: '', component: () => import('pages/DocPage.vue') },
    //   { path: 'doc-detail', component: () => import('pages/DocPage.vue') },
    // ],
  },
  {
    path: '/tiptap',
    component: () => import('pages/TipTap.vue'),
  },
  {
    path: '/main',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/main/swreq',
      },
      {
        path: 'swreq/',
        component: () => import('pages/swreq/IndexPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
