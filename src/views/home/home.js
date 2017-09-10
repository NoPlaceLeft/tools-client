
export class Home {
  constructor() {
    this.categories = [
      {
        name: 'Favorites',
        tools: []
      },
      {
        name: 'Leadership',
        tools: []
      },
      {
        name: 'Entry',
        tools: []
      },
      {
        name: 'Gospel',
        tools: []
      },
      {
        name: 'Church Formation',
        tools: [
          {
            name: 'Four Fields GenMap',
            image: 'assets/fourFields-genmap.png'
          },
          {
            name: 'Church Circles GenMap',
            image: 'assets/churchCircles-genmap.png'
          }
        ]
      },
      {
        name: 'Discipleship',
        tools: []
      }
    ];
  }
}
