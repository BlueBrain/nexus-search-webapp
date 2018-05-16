import { spawn } from 'child_process';

export default () => {
  const args = [
    'port-forward',
    process.env.ELASTIC_SEARCH_POD_NAME,
    `${process.env.SEARCH_PROXY_PORT}:${process.env.ELASTIC_SEARCH_POD_PORT}`
  ]
  const portForward = spawn('oc', args);

  portForward.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  portForward.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  portForward.on('close', (code) => {
    console.log(`port forwarding exited with code ${code}`);
  });
}
