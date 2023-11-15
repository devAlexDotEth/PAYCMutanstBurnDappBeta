import React, { useState } from "react";
import Popup from "../components/Popup";
import { useContext } from "react";
import { BlockchainContext } from "../context/BlockchainContext";
import Tile from '../components/tile';
import Button from '../components/button';
import Navigation from '../components/navigation';
import Wallet from '../components/wallet';
import Portal from "../template/portal";
import Box from "../components/box";
import Dialog from "../components/dialog";
import DialogHeader from "../assets/dialog-header.png";
import Body from "../components/body";

const Gallery = () => {

  const [isRevealed, setIsRevealed] = useState(false);

  const { connectWallet } = useContext(BlockchainContext);
  function handleConnectWallet() {
    connectWallet();
  }

  const {
    unstakedNfts,
    stake,
    currentSignerAddress,
  } = useContext(BlockchainContext);

  const [showPopup, setShowPopup] = useState(false);

  const [selectedImages, setSelectedImages] = useState([]);
  const [nftType, setNftType] = useState("");

  const imageHandler = (tokenId, type) => {
    if (selectedImages.includes(tokenId)) {
      setSelectedImages(
        selectedImages.filter((token_id) => token_id !== tokenId)
      );
    } else {
      setSelectedImages((oldArray) => [...oldArray, tokenId]);
    }
    setNftType(type);
  };

  {/* ALEX NOTES: How do we deprecate this popover and replace with our own? */ }
  const stakeHandler = async () => {
    if (selectedImages.length !== 1) {
      setIsRevealed(true);
    } else {
      let val = await stake(selectedImages, nftType);

      if (val === 1) {
        setShowPopup(true);
      }
    }
  };

  return (

    <Box localStyles={{
      overflowY: isRevealed && "hidden",
      height: isRevealed && "100vh"
    }}>
      <Navigation
        localStyles={{ position: 'fixed', top: 0 }}
        wallet={
          currentSignerAddress.toString() === "" ? (
            <Button size='S' variant='PRIMARY' onClick={handleConnectWallet}>Connect Wallet</Button>
          ) : (
            // ALEX NOTES: Are there any API's we can call to add balance / address?
            <Wallet balance={0.0389} address="0x6972b4e81673bcec5f8b4c280E6F752C800D6ED6" />
          )
        }>
        <Button as="a" variant='TERTIARY' size='M' href='https://www.pepeapeyachtclub.com' target="_blank">Return home</Button>
      </Navigation>

      {isRevealed &&
        <Dialog backdropClose={() => setIsRevealed(!isRevealed)} image={DialogHeader}>
          <Body size='L'>Sheesh! Please select 5 NFT's</Body>
          <Button size='M' variant="PRIMARY" onClick={() => setIsRevealed(!isRevealed)}>Ok</Button>
        </Dialog>
      }
      {/* Popover Exchanging */}
      <Popup showPopup={showPopup} setShowPopup={setShowPopup} />

      <Portal
        title="Mutant Burn"
        toolbar={
          <>
            {/* ALEX NOTES: Could we look to add a filter? */}
            <Box localStyles={{ width: 'auto' }}>
              {/* <Button size='S' variant='SECONDARY' active onClick={<></>}>Filter by</Button> */}
            </Box>
            {currentSignerAddress.toString()
              ?
              <Button size='S' variant='PRIMARY' onClick={stakeHandler}>Burn Selected</Button>
              :
              <Button size='S' variant='PRIMARY' disabled>Burn Selected</Button>
            }
          </>
        }
        children={
          <>
            {unstakedNfts &&
              unstakedNfts.tokenIds &&
              unstakedNfts.tokenIds.map((tokenId, i) => {
                return (
                  <div className="form-group">
                    <input
                      type="checkbox"
                      hidden
                      onClick={() => {
                        imageHandler(tokenId);
                      }}
                    />
                    <label className="flex justify-center items-center rounded-[1rem] cursor-pointer p-2">
                      <Tile
                        localStyles={{
                          border: selectedImages.includes(tokenId)
                            ? "4px solid yellow"
                            : "",
                        }}
                        image={unstakedNfts.metadatas[i]}
                        title="" // We should insert the ID here
                        onClick={() => {
                          imageHandler(tokenId, unstakedNfts.type[i]);
                        }}
                      />
                    </label>
                  </div>
                );
              })
            }
          </>
        }
      />

    </Box>

  );
};

export default Gallery;
