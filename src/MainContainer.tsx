type Props = {
  children?: React.ReactNode;
};

function MainContainer({children}: Props) {
  return <main className="container flex flex-col items-center px-10">{children}</main>;
}

export default MainContainer;
