/* global cy */

describe('Testing map with drilldown', function() {
    it('tests the drilldown chart', function() {
      expect(true).to.equal(true)
      cy.server()
      cy.route('**/spreadsheets/**').as('data_request')
      cy.visit('/samples/map-with-options-and-drilldown/map-with-options-and-drilldown.html')
      cy.wait('@data_request')
      cy.window().then(win => win.drilldownChart('Kansas City, MO-KS'))
      cy.wait(1000)
      //cy.screenshot()
      cy.get('#drilldown_modal').click('top')
    })

  it('tests the search input', function () {
    cy.get('.JCHS-chart__search-box__input').type('albany', { delay: 100 })
    cy.wait(200)
    cy.get('ul>li').eq(0).should('be.hidden')
    cy.get('li').contains('Albany').should('be.visible').click()
    cy.get('.JCHS-chart__search-box__input').should('have.value', 'Albany, GA')
    ///cy.get('ul>li').eq(0).should('have.css', 'display').and('equal', 'none')
  })

  it('tests the radio button input', function () {
    cy.window().then( win => expect(win.chart.series[0].name).to.equal('All Households Age 50 and Over') )
    cy.window().then( win => cy.get('.' + win.$.escapeSelector('highcharts-name-elko,-nv')).should('have.class', 'highcharts-color-1').click())
    
    cy.get('#user_input').contains('50 to 64').click()
    cy.window().then( win => expect(win.chart.series[0].name).to.equal('Households Aged 50-64') )
    cy.window().then( win => cy.get('.' + win.$.escapeSelector('highcharts-name-elko,-nv')).should('have.class', 'highcharts-color-0').click())
    
    cy.get('#user_input').contains('65 and Over').click()
    cy.window().then( win => expect(win.chart.series[0].name).to.equal('Households Age 65 and Over') )
    cy.window().then( win => cy.get('.' + win.$.escapeSelector('highcharts-name-elko,-nv')).should('have.class', 'highcharts-color-1').click())

  })
})