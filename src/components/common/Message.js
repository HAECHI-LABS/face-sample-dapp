function Message({ type, className, children }) {
  return (
    <div className={`message ${type ? 'is-' + type : ''} ${className}`}>
      <div className="message-body">{children}</div>
    </div>
  );
}

export default Message;
