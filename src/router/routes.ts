import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/DocLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DocPage.vue') },
      { path: 'doc-detail', component: () => import('pages/DocPage.vue') },
    ],
  },
  {
    path: '/tiptap',
    component: () => import('pages/TipTap.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
