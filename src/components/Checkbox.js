function Checkbox({ className, item, onCheck, ...rest }) {
  return (
    <div className="Checkbox">
      <input
        type="checkbox"
        className={`check ${className}`}
        onChange={(e) => onCheck ? onCheck(e.target.checked, item) : null}
        {...rest}
      />
    </div>
  );
}

export default Checkbox;
