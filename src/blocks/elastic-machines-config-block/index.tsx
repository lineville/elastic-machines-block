import { FileBlockProps, getLanguageFromFilename } from "@githubnext/utils";
import "./index.css";
import yaml from "js-yaml";
import { useState, useEffect } from "react";

export default function (props: FileBlockProps) {
  const { context, content, onRequestGitHubData } = props;
  const doc: any = yaml.load(content);
  const language = Boolean(context.path)
    ? getLanguageFromFilename(context.path)
    : "N/A";

  const [runs, setRuns] = useState([]);
  const [runners, setRunners] = useState([]);

  async function getWorkflowRuns() {
    try {
      const res = await onRequestGitHubData(
        `/repos/${context.owner}/${context.repo}/actions/runs`,
        {
          accept: "application/vnd.github.v3+json",
          per_page: 100,
          ref: context.sha,
        }
      );

      console.log(res.workflow_runs);
      setRuns(res.workflow_runs);
      return res.workflow_runs;
    } catch (e) {
      console.error(e);
    }
  }

  async function getSelfHostedRunners() {
    try {
      const res = await onRequestGitHubData(
        `/repos/${context.owner}/${context.repo}/actions/runners`,
        {
          accept: "application/vnd.github.v3+json",
          per_page: 100,
          ref: context.sha,
        }
      );

      console.log(res.runners);
      setRunners(res.runners);
      return res.runners;
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    getWorkflowRuns();
    // getSelfHostedRunners();
  }, []);

  return (
    <div className="Box m-4">
      <div className="Box-header">
        <h3 className="Box-title">
          File: {context.path} {language}
        </h3>
      </div>
      <div className="Box-body">
        <h3>Providers</h3>

        <ul>
          {doc.map((provider: any) => (
            <li key={provider.with.virtualMachineScaleSetId}>
              <h4>{provider.provider}</h4>
              <ul>
                {provider.scale.map((scale: any, idx: number) => (
                  <ul key={idx}>
                    <li>- Min: {scale.minimumMachines} runners</li>
                    <li>- Max: {scale.maximumMachines} runners</li>
                  </ul>
                ))}
              </ul>
              <br />
            </li>
          ))}
        </ul>

        {/* <h3>Self-hosted Runners</h3>
        <ul>
          {runners.map((runner: any) => (
            <li key={runner.id}>
              <pre id="json">{JSON.stringify(runner, null, '\t')}</pre>
            </li>
          ))}
        </ul> */}

        <h3>Workflow Runs</h3>
        <ul>
          {runs.map((run: any) => (
            <li key={run.id}>
              <pre id="json">{JSON.stringify(run, null, "\t")}</pre>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
