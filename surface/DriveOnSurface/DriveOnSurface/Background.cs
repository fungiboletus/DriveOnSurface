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
        public Sprite BackgroundImg;

        public Sprite BackgroundSkyImg;

        public Background(Vector2 Position) {

            BackgroundImg = new Sprite();

            BackgroundImg.Position = Position;
            BackgroundImg.rotation = 0;
            BackgroundImg.depth = 1;

            BackgroundSkyImg = new Sprite();

            BackgroundSkyImg.Position = Position;
            BackgroundSkyImg.rotation = 0;
            BackgroundSkyImg.depth = 0;
            
        }


        public void Draw(SpriteBatch sb)
        {
            BackgroundImg.Draw(sb);
            BackgroundSkyImg.Draw(sb);
        }

        public void LoadContent(ContentManager theContentManager)
        {
            BackgroundImg.LoadContent(theContentManager, "background");
            BackgroundSkyImg.LoadContent(theContentManager, "trees");
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

    }
}
