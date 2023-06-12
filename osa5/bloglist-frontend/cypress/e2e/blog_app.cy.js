
describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'testpassword'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)

    const secondUser = {
      name: 'Second User',
      username: 'seconduser',
      password: 'secondpassword'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', secondUser)

    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
    cy.get('#username')
    cy.get('#password')
    cy.get('#login-button')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('testuser')
      cy.get('#password').type('testpassword')
      cy.get('#login-button').click()

      cy.contains('Test User logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('wronguser')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()

      cy.contains('wrong username/password')

      cy.get('html').should('not.contain', 'Test User logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'testuser', password: 'testpassword' })
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#title').type('A blog created by cypress')
      cy.get('#author').type('Cypress')
      cy.get('#url').type('http://test.com')
      cy.get('#create-button').click()

      cy.contains('A blog created by cypress')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.contains('new blog').click()
        cy.get('#title').type('Another blog created by cypress')
        cy.get('#author').type('Cypress')
        cy.get('#url').type('http://another.test.com')
        cy.get('#create-button').click()

        cy.contains('Another blog created by cypress')
      })

      it('it can be liked', function () {
        cy.contains('Another blog created by cypress').parent().find('#view-button').as('viewButton')
        cy.get('@viewButton').click()

        cy.contains('Another blog created by cypress').parent().find('#like-button').as('likeButton')
        cy.get('@likeButton').click()

        cy.contains('likes 1')
      })

      it('A blog can be deleted by the user who added it', function () {
        cy.contains('Another blog created by cypress').parent().find('#view-button').as('viewButton')
        cy.get('@viewButton').click()

        cy.contains('Another blog created by cypress').parent().find('#delete-button').as('deleteButton')

        cy.on('window:confirm', () => true);
        cy.get('@deleteButton').click()
        cy.wait(1000)
        cy.get('body').should('not.contain', 'Another blog created by cypress')

      })
    })

    it('User can see the delete button on their own blogs', function () {
      cy.createBlog({
        title: 'First user blog',
        author: 'First User',
        url: 'http://firstuserblog.com'
      })

      cy.contains('First user blog').parent().find('#view-button').click()
      cy.contains('First user blog').parent().find('#delete-button')
        .should('be.visible')
    })

    it('User cannot see the delete button on other users\' blogs', function () {
      cy.createBlog({
        title: 'First user blog',
        author: 'First User',
        url: 'http://firstuserblog.com'
      })
      cy.contains('logout').click()
      cy.login({ username: 'seconduser', password: 'secondpassword' })

      cy.contains('First user blog').parent().find('#view-button').click()
      cy.contains('First user blog').parent().find('#delete-button')
        .should('not.exist')
    })

    describe('When several blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'First blog',
          author: 'First Author',
          url: 'http://firstblog.com',
        })

        cy.createBlog({
          title: 'Second blog',
          author: 'Second Author',
          url: 'http://secondblog.com',
        })

        cy.createBlog({
          title: 'Third blog',
          author: 'Third Author',
          url: 'http://thirdblog.com',
        })
      })

      it('Blogs are ordered according to likes', function () {
        cy.contains('First blog').parent().find('#view-button').click()
        cy.contains('First blog').parent().find('#like-button').as('firstBlogLikeButton')
        cy.get('@firstBlogLikeButton').click()
        cy.wait(1000)
        cy.get('@firstBlogLikeButton').click()
        cy.wait(1000)

        cy.contains('Second blog').parent().find('#view-button').click()
        cy.contains('Second blog').parent().find('#like-button').as('secondBlogLikeButton')
        cy.get('@secondBlogLikeButton').click()
        cy.wait(1000)

        cy.contains('Third blog').parent().find('#view-button').click()

        cy.get('.blog').eq(0).should('contain', 'First blog')
        cy.get('.blog').eq(1).should('contain', 'Second blog')
        cy.get('.blog').eq(2).should('contain', 'Third blog')
      })

      it('Blogs are ordered according to likes after their order changes', function () {
        cy.contains('First blog').parent().find('#view-button').click()
        cy.contains('Second blog').parent().find('#view-button').click()
        cy.contains('Third blog').parent().find('#view-button').click()
  
        cy.contains('First blog').parent().find('#like-button').click()
        cy.wait(1000)
  
        cy.contains('Second blog').parent().find('#like-button').as('secondBlogLikeButton')
        cy.get('@secondBlogLikeButton').click()
        cy.wait(1000)
        cy.get('@secondBlogLikeButton').click()
        cy.wait(1000)
  
        cy.contains('Third blog').parent().find('#like-button').as('thirdBlogLikeButton')
        cy.get('@thirdBlogLikeButton').click()
        cy.wait(1000)
        cy.get('@thirdBlogLikeButton').click()
        cy.wait(1000)
        cy.get('@thirdBlogLikeButton').click()
        cy.wait(1000)
  
        cy.get('.blog').eq(0).should('contain', 'Third blog')
        cy.get('.blog').eq(1).should('contain', 'Second blog')
        cy.get('.blog').eq(2).should('contain', 'First blog')
      })
    })

  })
})
