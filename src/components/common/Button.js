function Button({ type, children, ...rest }) {
  return (
    <div className={`button ${type ? 'is-' + type : ''}`} {...rest}>
      {children}
    </div>
  );
}

export default Button;
