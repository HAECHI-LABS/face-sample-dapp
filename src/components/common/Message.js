function Message({ type, children }) {
  return (
    <div className={`message ${type ? 'is-' + type : ''}`}>
      <div className="message-body">{children}</div>
    </div>
  );
}

export default Message;
