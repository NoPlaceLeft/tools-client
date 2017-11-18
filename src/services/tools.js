
export const tools = [
  {
    id: 0,
    name: 'Four Fields GenMap',
    image: 'assets/fourFields-genmap.png',
    canPersist: true,
    exportExtension: 'csv',
    docFormat: 'fourFields',
    component: 'gen-mapper',
    template: {
      format: 'fourFields',
      title: 'Four Fields',
      content: ''
    }
  },
  {
    id: 1,
    name: 'Church Circles GenMap',
    image: 'assets/churchCircles-genmap.png',
    canPersist: true,
    exportExtension: 'csv',
    docFormat: 'churchCircles',
    component: 'gen-mapper',
    template: {
      format: 'churchCircles',
      title: 'Church Circles',
      content: ''
    }
  }
];
