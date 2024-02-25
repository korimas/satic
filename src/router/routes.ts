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
  {
    path: '/main/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'swreq/',
        component: () => import('pages/swreq/IndexPage.vue'),
        children: [
          { path: '', redirect: '/main/swreq/article' },
          { path: 'article', component: () => import('pages/swreq/side/ArticleSide.vue') },
          { path: 'search', component: () => import('pages/swreq/side/SearchSide.vue') },
          { path: 'comment', component: () => import('pages/swreq/side/CommentSide.vue') },
        ]
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
