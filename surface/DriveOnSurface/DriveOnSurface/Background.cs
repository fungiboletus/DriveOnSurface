using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

namespace DriveOnSurface
{
    class Background : IDrawableObject
    {
        public enum Track { Menu, Classic, RainbowRoad };

        public Sprite BackgroundImg;

        public Sprite BackgroundSkyImg;

        public Track SelectedTrack;

        public Background(Vector2 Position,Track selectedTrack ) {

            this.SelectedTrack = selectedTrack;

            BackgroundImg = new Sprite();

            BackgroundImg.Position = Position;
            BackgroundImg.rotation = 0;
            BackgroundImg.depth = 1f;

            BackgroundSkyImg = new Sprite();

            BackgroundSkyImg.Position = Position;
            BackgroundSkyImg.rotation = 0;
            BackgroundSkyImg.depth = 0.10f;
            
        }


        public void Draw(SpriteBatch sb)
        {
            BackgroundImg.Draw(sb);
            if (BackgroundSkyImg != null)
            {
                BackgroundSkyImg.Draw(sb);
            }
        }

        public void LoadContent(ContentManager theContentManager)
        {
            switch (SelectedTrack)
            {
                case Track.Classic :
                    BackgroundImg.LoadContent(theContentManager, "classic-background");
                    BackgroundSkyImg.LoadContent(theContentManager, "classic-trees");
                    break;
                case Track.Menu :
                    BackgroundImg.LoadContent(theContentManager, "damier");
                    BackgroundSkyImg = null;
                    break;
                default :
                    break;
            }

            
        }

        public Vector2 getPosition()
        {
            return BackgroundImg.Position;
        }

        public void setPosition(Vector2 pos)
        {
            BackgroundImg.Position = pos;
            BackgroundSkyImg.Position = pos;
        }


        public string getID()
        {
            return "background";
        }
    }
}
