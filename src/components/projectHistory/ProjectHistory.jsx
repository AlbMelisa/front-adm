// ProjectHistory.jsx
import React from "react";
import PropTypes from "prop-types";
import "./projectHistory.css";

const formatCurrency = (v) =>
  typeof v === "number" ? v.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }) : v;

const ProjectHistory = ({ historyData }) => {
  const list = historyData.historyList || [];

  return (
    <div className="ph-root">
      {/* Top info boxes */}
      <div className="ph-top-grid">
        <div className="ph-box">
          <div className="ph-box-label">Presupuesto Actual</div>
          <div className="ph-box-value">{formatCurrency(historyData.budgetProject)}</div>
        </div>

        <div className="ph-box">
          <div className="ph-box-label">Fecha Estimada</div>
          <div className="ph-box-value">{historyData.newEndDate}</div>
        </div>

        <div className="ph-box">
          <div className="ph-box-label">Tipo de Proyecto</div>
          <div className="ph-box-value">{historyData.typeProject}</div>
        </div>
      </div>

      <div className="ph-description mb-4">
        <h3 className="ph-subtitle">Descripción del Proyecto</h3>
        <div className="ph-desc-text">{historyData.descriptionProject}</div>
      </div>

      <h3 className="ph-subtitle">Historial de Cambios</h3>

      <div className="ph-timeline-wrapper">
        <div className="ph-timeline-line" />
        <div className="ph-events">
          {list.map((evt, idx) => (
            <div key={idx} className="ph-event">
              <div className="ph-event-marker">
                <div className={`ph-dot ${idx === 0 ? "ph-dot-primary" : ""}`} />
              </div>

              <div className="ph-event-body">
                <div className="ph-event-meta">
                  <div className="ph-event-date">🕒 {evt.changeDate}</div>
                  <div className="ph-event-budget">{formatCurrency(evt.oldBudget)}</div>
                </div>

                <div className="ph-event-section">
                  <div className="ph-section-title">Funciones Previas</div>
                  <div className="ph-functions">
                    {evt.oldFunctions && evt.oldFunctions.length > 0 ? (
                      evt.oldFunctions.map((f, i) => (
                        <div key={i} className="ph-fn">
                          <div className="ph-fn-name">{f.name}</div>
                          <div className="ph-fn-desc">{f.description}</div>
                        </div>
                      ))
                    ) : (
                      <div className="ph-fn-empty">— Sin funciones previas —</div>
                    )}
                  </div>
                </div>

                <div className="ph-event-section">
                  <div className="ph-section-title">Motivo del Cambio</div>
                  <div className="ph-reason">{evt.changeReason}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default ProjectHistory;
