import React, { useEffect, useState } from 'react';
import { ReportAssemblerService } from '../services/reportAssembler';
import type { AssembledProjectReport } from '../services/reportAssembler';

interface ReportPreviewScreenProps {
  projectId: string;
  assembler: ReportAssemblerService;
}

export const ReportPreviewScreen: React.FC<ReportPreviewScreenProps> = ({
  projectId,
  assembler,
}) => {
  const [report, setReport] = useState<AssembledProjectReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    assembler.loadProjectReport(projectId).then((result) => {
      if (isMounted) {
        setReport(result);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [projectId, assembler]);

  if (loading) {
    return <div>טוען תצוגה מקדימה...</div>;
  }

  if (!report) {
    return <div>לא נמצא פרויקט להצגה.</div>;
  }

  return (
    <section>
      <h1>{report.project.name}</h1>
      {report.areas.map((area) => (
        <article key={area.id}>
          <h2>{area.title}</h2>
          {area.summary ? <p>{area.summary}</p> : null}
          {area.findings.map((finding) => (
            <div key={finding.id}>
              <h3>{finding.title}</h3>
              <p>{finding.description ?? ''}</p>
              <p>מסקנה: {finding.conclusion ?? 'לא סופק'}</p>
              <p>עלות משוערת: {finding.estimatedCost ?? 'לא סופק'}</p>
              <ul>
                {finding.images.map((image) => (
                  <li key={image.id}>{image.caption ?? image.path}</li>
                ))}
              </ul>
            </div>
          ))}
        </article>
      ))}
    </section>
  );
};
