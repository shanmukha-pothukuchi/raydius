import React from "react";

const User = ({ params }: { params: { id: string } }) => {
  return <div className="p-6">{params.id}</div>;
};

export default User;
