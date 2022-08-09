import NotFound from './common/NotFound';
import Hello from './Hello';
const routeConfig = [
  {
    path: '/',
    component: Hello,
    indexRoute: { component: Hello },
    childRoutes: [
      { path: 'about', component: NotFound },
      {
        path: 'inbox',
        component: Hello,
        childRoutes: [
          { path: '/messages/:id', component: Hello },
          {
            path: 'messages/:id',
            onEnter: function (nextState, replaceState) {
              replaceState(null, '/messages/' + nextState.params.id)
            }
          }
        ]
      }
    ]
  }
]
export { routeConfig };