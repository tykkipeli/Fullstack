const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

const blogs = helper.initialBlogs

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const listWithNoBlog = []

describe('total likes', () => {

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(listWithNoBlog)
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36) 
  })
})

describe('favorite blog', () => {

  const expectedFavoriteBlog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    likes: 12
  }

  test('is found correctly when the list has many blogs', () => {
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual(expectedFavoriteBlog);
  })

  test('is found correctly when the list has only one blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    });
  })

  test('returns null when the list is empty', () => {
    const result = listHelper.favoriteBlog(listWithNoBlog);
    expect(result).toBeNull();
  })
})



describe('most blogs', () => {
  test('of empty list is empty', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toEqual({})
  })

  test('when list has only one blog equals the author of that', () => {
    const result = listHelper.mostBlogs([blogs[0]])
    expect(result).toEqual({
      author: blogs[0].author,
      blogs: 1
    })
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

describe('most likes', () => {
  test('of empty list is empty', () => {
    expect(listHelper.mostLikes(listWithNoBlog)).toEqual({});
  });

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.mostLikes(listWithOneBlog);
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5
    });
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    });
  });
});
