type CreateFunctionBody = {
  service: string,
  image: string,
  network: string,
  envProcess: string,
  envVars: { [string]: string },
  registryAuth?: string
};

type DeleteFunctionBody = {
  functionName: string
};

type AlexaSessionApplication = {
  applicationId: string
};

type AlexaSession = {
  sessionId: string,
  application: AlexaSessionApplication
};

type AlexaIntent = {
  name: string
};

type AlexaRequest = {
  intent: AlexaIntent
};

type AlexaRequestBody = {
  session: AlexaSession,
  request: AlexaRequest
}

type PrometheusInnerAlertLabel = {
  alertname: string,
  function_name: string
};

type PrometheusInnerAlert = {
  status: string,
  labels: PrometheusInnerAlertLabel
};

type PrometheusAlert = {
  status: string,
  receiver: string,
  alerts: Array<PrometheusInnerAlert>
};

type Func  = {
  name: string,
  image: string,
  invocationCount: number,
  replicas: number,
  envProcess: string
};

type ScaleServiceRequest = {
  serviceName: string,
  replicas: number
};
