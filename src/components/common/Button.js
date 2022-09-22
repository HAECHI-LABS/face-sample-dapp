function Button({ type = 'light', children, ...rest }) {
  return (
    <div className={`button ${type ? 'is-' + type : ''}`} {...rest}>
      {children}
    </div>
  );
}

export default Button;
