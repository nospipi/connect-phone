const Page = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500)) //simulate loading
  return <div>Media Page</div>
}

export default Page
