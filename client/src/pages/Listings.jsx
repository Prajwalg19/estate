function Listing() {
    return (
        <main>
            <h1 className="p-2 my-5 text-2xl font-bold text-center">Create a Listing</h1>
            <form className="flex flex-col w-full max-w-4xl p-2 mx-auto sm:flex-row gap-4">
                <section className="flex flex-col flex-1 gap-4">
                    <input required type="text" className="p-2 rounded-md" placeholder="Name" />
                    <textarea required cols="30" rows="2" placeholder="Description" className="p-2 rounded-md"></textarea>
                    <input required type="text" className="p-2 rounded-md" placeholder="Address" />
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex gap-1">
                            <input id="sell" type="checkbox" className="w-4 " />
                            <label htmlFor="sell">Sell</label>
                        </div>
                        <div className="flex gap-1">
                            <input id="rent" type="checkbox" className="w-4" />
                            <label htmlFor="rent">Rent</label>
                        </div>
                        <div className="flex gap-1">
                            <input id="parking" type="checkbox" className="w-4" />
                            <label htmlFor="parking">Parking Spot</label>
                        </div>
                        <div className="flex gap-1">
                            <input id="furnished" type="checkbox" className="w-4" />
                            <label htmlFor="furnished">Furnished</label>
                        </div>
                        <div className="flex gap-1">
                            <input id="offer" type="checkbox" className="w-4" />
                            <label htmlFor="offer">Offer</label>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium whitespace-nowrap">Beds : </span>
                        <input type="number" className="w-1/4 p-2 text-center rounded-md" min="1" />
                        <span className="text-sm font-medium test-sm whitespace-nowrap">Bathrooms : </span>
                        <input type="number" className="w-1/4 p-2 text-center rounded-md" min="1" />
                    </div>

                    <p className="justify-between flex items-center space-x-3">
                        <span className="flex text-sm flex-col items-center">
                            <span>Regular Price :</span>
                            <span>(&#8377;/Month )</span>
                        </span>
                        <input type="number" min="0" className="w-1/3 rounded-md p-2" />
                    </p>
                    <p className="flex justify-between items-center space-x-3">
                        <span className="flex text-sm flex-col items-center">
                            <span>Discounted Price :</span>
                            <span>(&#8377;/Month )</span>
                        </span>
                        <input type="number" min="0" className="w-1/3 rounded-md p-2" />
                    </p>
                </section>
                <section className="flex flex-col flex-1">
                    <span className="mb-4">
                        <span className="font-semibold">Images:</span> The first image will be the cover (max 6)
                    </span>
                    <span className="flex justify-between">
                        <input type="file" className="p-2 border-2 border-gray-300" />
                        <button type="button" className="hover:shadow-md px-3 py-2 text-green-500 border-2 border-green-500 bg-opacity-0 rounded-md">
                            Upload
                        </button>
                    </span>
                    <button className="w-full p-2 mt-4 text-white bg-slate-700 rounded-md">Create Listing</button>
                </section>
            </form>
        </main>
    );
}

export default Listing;
