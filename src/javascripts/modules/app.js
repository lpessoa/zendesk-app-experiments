/**
 *  Example app
 **/

import { Timeline } from '@zendeskgarden/react-accordions';
import { Button } from '@zendeskgarden/react-buttons';
import { Field, Input, Label } from '@zendeskgarden/react-forms';
import { Col, Grid } from '@zendeskgarden/react-grid';
import { Row } from '@zendeskgarden/react-tables';
import { Tab, TabList, TabPanel, Tabs } from '@zendeskgarden/react-tabs';
import { ThemeProvider } from '@zendeskgarden/react-theming';
import { Span } from '@zendeskgarden/react-typography';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import I18n from '../../javascripts/lib/i18n';
import { resizeContainer } from '../lib/helpers';

export const StyledSpan = styled(Span).attrs({ isBold: true })`
  display: block;
`;


const MAX_HEIGHT = 10000
const API_ENDPOINTS = {
  organizations: '/api/v2/organizations.json'
}

const MyTable = () => (
  <Grid>
  <Row justifyContent="center">
    <Col sm="auto">
      <Timeline>
        <Timeline.Item>
          <Timeline.Content>
            <StyledSpan>Payment 100.00</StyledSpan>
            <Span hue="grey">Today 9:00 AM</Span>
          </Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Content>
            <StyledSpan>Payment 200.30</StyledSpan>
            <Span hue="grey">Feb 08, 9:05 AM</Span>
          </Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Content>
            <StyledSpan>Payment 50.30</StyledSpan>
            <Span hue="grey">Jan 21, 9:13 AM</Span>
          </Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Content>
            <StyledSpan>Received 240.00</StyledSpan>
            <Span hue="grey">Jan 21, 9:21 AM </Span>
          </Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Content>
            <StyledSpan>Received 240.00</StyledSpan>
            <Span hue="grey">Jan 21, 9:21 AM </Span>
          </Timeline.Content>
        </Timeline.Item>
      </Timeline>
    </Col>
  </Row>
  </Grid>
)

const MyTabs = ({userName}) => {
  const [selectedTab, setSelectedTab] = useState('tab-1');
  return(
  <Tabs selectedItem={selectedTab} onChange={setSelectedTab}>
  <TabList>
    <Tab item="tab-1">User</Tab>
    <Tab item="tab-2">Movements</Tab>
  </TabList>
  <TabPanel item="tab-1">
    <Row justifyContent="center">
      <Col sm={5}>
        <Field>
          <Label>User Name</Label>
          <Input isBare readOnly value={userName} />
        </Field>
        <br/>
      </Col>
    </Row>
    <Row justifyContent="center">
      <Col sm={5}>
        <Field>
          <Label>DNI</Label>
          <Input isBare readOnly value="123455678" />
        </Field>
        <br/>
      </Col>
    </Row>
    <Row justifyContent="center">
      <Col sm={5}>
        <Field>
          <Label>Cellphone</Label>
          <Input isBare readOnly value="+45 366136223" />
        </Field>
        <br/>
      </Col>
    </Row>
  </TabPanel>
  <TabPanel item="tab-2">
    <MyTable></MyTable>
  </TabPanel>
</Tabs>
)};


const Core =  ({client, userName}) => {
  useEffect(() => {
    resizeContainer(client, 400)
  }, []);

  return (
    <ThemeProvider>
     <MyTabs userName={userName} />
     <div style={{float:"right"}}>
      <Button size="small">Cambio de clave</Button>
     </div>

    </ThemeProvider>
  )
};

class App {
  constructor (client, appData) {
    this._client = client
    this._appData = appData

    this.states = {}

    // this.initializePromise is only used in testing
    // indicate app initilization(including all async operations) is complete
    this.initializePromise = this.init()
  }

  /**
   * Initialize module, render main template
   */
  async init () {
    const currentUser = (await this._client.get('currentUser')).currentUser
    const {ticket} = (await this._client.get('ticket'))
    this.states.currentUserName = ticket.requester.name

    I18n.loadTranslations(currentUser.locale)

    const organizations = await this._client
      .request(API_ENDPOINTS.organizations)
      .catch(this._handleError.bind(this))

    if (organizations) {
      this.states.organizations = organizations.organizations

      ReactDOM.render(<Core client={this._client}  userName={ticket.requester.name} />, document.getElementById('root'));

      return
    }
  }

  /**
   * Handle error
   * @param {Object} error error object
   */
  _handleError (error) {
    console.log('An error is handled here: ', error.message)
  }
}

export default App
