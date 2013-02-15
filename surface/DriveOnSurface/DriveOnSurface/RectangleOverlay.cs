using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace DriveOnSurface
{
    /**
     * Classe pour dessiner des rectangles.
     **/
    public class RectangleOverlay : DrawableGameComponent
    {
        SpriteBatch spriteBatch;
        Texture2D dummyTexture;
        public Rectangle dummyRectangle;
        Color Colori;
        float orientation;

        public RectangleOverlay(Rectangle rect, Color colori, Game game, float angle)
            : base(game)
        {
            // Choose a high number, so we will draw on top of other components.
            DrawOrder = 1000;
            dummyRectangle = rect;
            Colori = colori;
            orientation = angle;
        }

        public new void LoadContent()
        {
            spriteBatch = new SpriteBatch(GraphicsDevice);
            dummyTexture = new Texture2D(GraphicsDevice, 1, 1);
            dummyTexture.SetData(new Color[] { Color.White });
        }

        public void Draw(SpriteBatch sb)
        {
            
            sb.Draw(dummyTexture, dummyRectangle,dummyRectangle, Colori, orientation, Vector2.Zero, SpriteEffects.None, 0f );
     
        }
    }
}
