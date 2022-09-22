function Box({ title, children }) {
  return (
    <div className="box">
      <h2 className="box__title title is-4">{title}</h2>
      <div className="box__body">{children}</div>
    </div>
  );
}

export default Box;
