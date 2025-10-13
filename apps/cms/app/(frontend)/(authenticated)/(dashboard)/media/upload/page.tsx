const Page = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500)) //simulate loading
  return <div>UPLOAD Media Page</div>
}

export default Page
