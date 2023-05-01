// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Broker",
    group: "MQ",
    properties: ({}) => ({
      AuthenticationStrategy: "simple",
      AutoMinorVersionUpgrade: true,
      BrokerName: "my-broker",
      DeploymentMode: "SINGLE_INSTANCE",
      EncryptionOptions: {
        UseAwsOwnedKey: true,
      },
      EngineType: "ActiveMQ",
      EngineVersion: "5.17.1",
      HostInstanceType: "mq.t3.micro",
      Logs: {
        Audit: false,
        General: false,
      },
      MaintenanceWindowStartTime: {
        DayOfWeek: "THURSDAY",
        TimeOfDay: "19:00",
        TimeZone: "UTC",
      },
      PubliclyAccessible: true,
      StorageType: "efs",
      Users: [
        {
          Username: "my-user",
          Password: JSON.parse(process.env.MY_BROKER_PASSWORD)[0],
        },
      ],
    }),
    dependencies: ({}) => ({
      configuration: "my-broker-configuration",
    }),
  },
  {
    type: "Configuration",
    group: "MQ",
    properties: ({}) => ({
      AuthenticationStrategy: "simple",
      Data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<broker xmlns="http://activemq.apache.org/schema/core" schedulePeriodForDestinationPurge="10000">
  <!--
  A configuration contains all of the settings for your ActiveMQ broker, in XML format (similar to ActiveMQ's activemq.xml file).
  You can create a configuration before creating any brokers. You can then apply the configuration to one or more brokers.

  You can use additional attributes for the broker element above. These attributes allow you to configure broker-wide settings.

  For more information, see Configuration and Amazon MQ Broker Configuration Parameters in the Amazon MQ Developer Guide:
  https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/amazon-mq-broker-configuration-parameters.html
  -->
  <!--
  Mirrored queues let you send a copy of each message to a topic with a similar name automatically.
  For more information, see http://activemq.apache.org/mirrored-queues.html

  Virtual destinations let you configure advanced routing of messages between destinations.
  For more information, see http://activemq.apache.org/virtual-destinations.html
  -->
  <!--
  <destinationInterceptors>
    <mirroredQueue copyMessage="true" postfix=".qmirror" prefix=""/>
    <virtualDestinationInterceptor>
      <virtualDestinations>
        <virtualTopic name="&gt;" prefix="VirtualTopicConsumers.*." selectorAware="false"/>
        <compositeQueue name="MY.QUEUE">
          <forwardTo>
            <queue physicalName="FOO"/>
            <topic physicalName="BAR"/>
          </forwardTo>
        </compositeQueue>
      </virtualDestinations>
    </virtualDestinationInterceptor>
  </destinationInterceptors>
  -->
  <!--
  By default, Amazon MQ optimizes for queues with fast consumers:
  Consumers are considered fast if they are able to keep up with the rate of messages generated by producers.
  Consumers are considered slow if a queue builds up a backlog of unacknowledged messages, potentially causing a decrease in producer throughput.
  To instruct Amazon MQ to optimize for queues with slow consumers, set the concurrentStoreAndDispatchQueues attribute to false.
  For more information, see https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/ensuring-effective-amazon-mq-performance.html
  -->
  <!--
  <persistenceAdapter>
    <kahaDB  concurrentStoreAndDispatchQueues="false"/>
  </persistenceAdapter>
  -->
  <destinationPolicy>
    <policyMap>
      <policyEntries>
        <!--
        gcInactiveDestinations is used to automatically purge inactive destinations
        preventing them from unnecessarily using broker resources.

        An 'inactive' destination is one that has no messages pending and no consumers connected.

        For more information, see: http://activemq.apache.org/delete-inactive-destinations.html
        -->
        <policyEntry topic="&gt;" gcInactiveDestinations="true" inactiveTimoutBeforeGC="600000">
          <!--
          The constantPendingMessageLimitStrategy is used to prevent
          slow topic consumers to block producers and affect other consumers
          by limiting the number of messages that are retained

          For more information, see: http://activemq.apache.org/slow-consumer-handling.html
          -->
          <pendingMessageLimitStrategy>
            <constantPendingMessageLimitStrategy limit="1000"/>
          </pendingMessageLimitStrategy>
        </policyEntry>
        <policyEntry queue="&gt;" gcInactiveDestinations="true" inactiveTimoutBeforeGC="600000" />
        <!--
        Destination policies let you configure a rich set of behaviors for your queues and topics.
        For more information, see http://activemq.apache.org/per-destination-policies.html
        -->
        <!--
        <policyEntry topic="FOO.&gt;">
          <dispatchPolicy>
            <roundRobinDispatchPolicy/>
          </dispatchPolicy>
          <subscriptionRecoveryPolicy>
            <lastImageSubscriptionRecoveryPolicy/>
          </subscriptionRecoveryPolicy>
        </policyEntry>
        <policyEntry advisoryForConsumed="true" tempTopic="true"/>
        <policyEntry advisoryForConsumed="true" tempQueue="true"/>
        -->
      </policyEntries>
    </policyMap>
  </destinationPolicy>
  <!--
  Typically, destinations are created automatically when they are used. Amazon MQ lets you create destinations when the broker is started.
  For more information, see http://activemq.apache.org/configure-startup-destinations.html
  -->
  <!--
  <destinations>
    <queue physicalName="FOO.BAR"/>
    <topic physicalName="SOME.TOPIC"/>
  </destinations>
  -->
  <!--
  You can control advanced ActiveMQ features using plugins.
  -->
  <plugins>
    <!--
    The Authorization plugin allows you to control the groups of users that are allowed to perform certain operations on your destinations.
    For more information, see http://activemq.apache.org/security.html
    -->
    <!--
    <authorizationPlugin>
      <map>
        <authorizationMap>
          <authorizationEntries>
            <authorizationEntry admin="guests,users" queue="GUEST.&gt;" read="guests" write="guests,users"/>
            <authorizationEntry admin="guests,users" read="guests,users" topic="ActiveMQ.Advisory.&gt;" write="guests,users"/>
          </authorizationEntries>
          <tempDestinationAuthorizationEntry>
            <tempDestinationAuthorizationEntry admin="tempDestinationAdmins" read="tempDestinationAdmins" write="tempDestinationAdmins"/>
          </tempDestinationAuthorizationEntry>
        </authorizationMap>
      </map>
    </authorizationPlugin>
    -->
    <!--
    The Discarding DLQ plugin simplifies the configuration of your global dead-letter queue strategy.
    You can take advantage of a more granular per-destination control by using destination policies.
    For more information, see http://activemq.apache.org/message-redelivery-and-dlq-handling.html
    -->
    <!--
    <discardingDLQBrokerPlugin dropAll="true" dropTemporaryQueues="true" dropTemporaryTopics="true"/>
    -->
    <!--
    The Force Persistency Mode plugin can override the persistency mode set on messages.
    -->
    <!--
    <forcePersistencyModeBrokerPlugin persistenceFlag="true"/>
    -->
    <!--
    The Redelivery plugin extends the capabilities of destination policies with respect to message redelivery.
    For more information, see http://activemq.apache.org/message-redelivery-and-dlq-handling.html
    -->
    <!--
    <redeliveryPlugin fallbackToDeadLetter="true" sendToDlqIfMaxRetriesExceeded="true">
      <redeliveryPolicyMap>
        <redeliveryPolicyMap>
          <redeliveryPolicyEntries>
            <redeliveryPolicy maximumRedeliveries="4" queue="SpecialQueue" redeliveryDelay="10000"/>
          </redeliveryPolicyEntries>
          <defaultEntry>
            <redeliveryPolicy initialRedeliveryDelay="5000" maximumRedeliveries="4" redeliveryDelay="10000"/>
          </defaultEntry>
        </redeliveryPolicyMap>
      </redeliveryPolicyMap>
    </redeliveryPlugin>
    -->
    <!--
    The Statistics plugin lets you query broker or destination statistics by sending messages to the broker.
    For more information, see http://activemq.apache.org/statisticsplugin.html
    -->
    <!--
    <statisticsBrokerPlugin/>
    -->
    <!--
    The Timestamping plugin lets the broker use server-side time instead of client-provided time for messages.
    For more information, see http://activemq.apache.org/timestampplugin.html
    -->
    <!--
    <timeStampingBrokerPlugin ttlCeiling="86400000" zeroExpirationOverride="86400000"/>
    -->
  </plugins>
  <!--
  Network connectors let you connect brokers into networks of brokers.
  For more information, see Creating and Configuring an Amazon MQ Network of Brokers
  (https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/amazon-mq-creating-configuring-network-of-brokers.html)
  in the Amazon MQ Developer Guide and also Networks of Brokers
  (http://activemq.apache.org/networks-of-brokers.html) in the ActiveMQ documentation.
  -->
  <!--
  <networkConnectors>
    <networkConnector name="myNetworkConnector" userName="commonUser" uri="masterslave:(ssl://b-1a2b3c4d-1.mq.region.amazonaws.com:61617,ssl://b-1a2b3c4d-2.mq.region.amazonaws.com:61617)"/>
  </networkConnectors>
  -->
</broker>
`,
      EngineType: "ActiveMQ",
      EngineVersion: "5.17.1",
      Name: "my-broker-configuration",
    }),
  },
];
