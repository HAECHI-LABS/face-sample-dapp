function Field({ label, children }) {
  return (
    <div className="field is-horizontal">
      <div className="field-label">
        <label className="label">{label}</label>
      </div>
      <div className="field-body">
        <div className="field">
          <p className="control">{children}</p>
        </div>
      </div>
    </div>
  );
}

export default Field;
